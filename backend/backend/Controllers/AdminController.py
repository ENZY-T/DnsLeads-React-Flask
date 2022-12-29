from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..Models import Users
from .. import db
from ..AllFunctions import usersObjToDictArr
from datetime import timedelta


admin = Blueprint("admin", __name__)


def returnUsers(id=None):
    all_users = None
    if id == None:
        all_users = Users.query.all()
    else:
        all_users = Users.query.filter_by(id=id)
    return usersObjToDictArr(all_users)


def getUserFromEmail(email):
    try:
        user = Users.query.filter_by(email=email).first()
        return user
    except:
        return False


def saveUserImage(file, userID, saveName):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    users_dir = os.path.join(app.root_path, "users")
    user_folder = os.path.join(users_dir, str(userID))
    if not os.path.exists(user_folder):
        os.mkdir(user_folder)
    save_file_path = os.path.join(
        user_folder, f"{saveName}.{str(file.filename).split('.')[-1]}")
    file.save(save_file_path)
    return save_file_path


@admin.route("/login", methods=["POST"])
def login():
    user_data = request.json
    if "email" in user_data and "password" in user_data:
        user = getUserFromEmail(user_data["email"])
        if user:
            if check_password_hash(user.password, user_data["password"]):
                expires = timedelta(hours=24)
                access_token = create_access_token(
                    identity=user.id, expires_delta=expires)
                return jsonify({"access_token": access_token}), 200
            else:
                return jsonify("Something went wrong please check the credentials"), 401
        else:
            return jsonify("User not exist"), 404
    else:
        return jsonify("Fill all fields"), 404


@admin.route("/register", methods=['POST'])
def register():
    usr = request.form
    usrImg = request.files
    usrID = str(uuid4())

    address_proof_img = saveUserImage(
        usrImg["address_proof_img"], usrID, "address_proof_img")
    passport_img = saveUserImage(usrImg["passport_img"], usrID, "passport_img")
    police_check_img = saveUserImage(
        usrImg["police_check_img"], usrID, "police_check_img")
    children_check_img = saveUserImage(
        usrImg["children_check_img"], usrID, "children_check_img")
    agreement_img = saveUserImage(
        usrImg["agreement_img"], usrID, "agreement_img")

    new_user = Users(
        id=usrID,
        name=usr["name"],
        address=usr["address"],
        zip_code=usr["zip_code"],
        contact_no=usr["contact_no"],
        email=usr["email"],
        abn=usr["abn"],
        passport_number=usr["passport_number"],
        bank_name=usr["bank_name"],
        account_type=usr["account_type"],
        account_name=usr["account_name"],
        account_number=usr["account_number"],
        bsb=usr["bsb"],

        address_proof_img=address_proof_img,
        passport_img=passport_img,
        police_check_img=police_check_img,
        children_check_img=children_check_img,
        agreement_img=agreement_img,

        verified=False,
        password=generate_password_hash(usr["password"]).decode('utf-8')
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify("done")
    except Exception as e:

        return str(e),


@admin.route("/logout", methods=["POST"])
def logout():
    return 'logout'


@admin.route("/get", methods=["GET"])
def getUsers():
    all_users = returnUsers()

    return jsonify(all_users)


@admin.route("/get/user", methods=["POST"])
def getSingleUsers():
    if "id" in request.json:
        id = request.json["id"]
        all_users = returnUsers(id)
        return jsonify(all_users)

    else:
        return {"error": "id required"}, 400


@admin.route("/del/user", methods=["POST"])
def delSingleUsers():
    if "id" in request.json:
        id = request.json["id"]
        del_user = Users.query.filter_by(id=id).delete()
        return "", 200

    else:
        return {"error": "id required"}, 400


@admin.route("/update/user", methods=["POST"])
def updateSingleUsers():
    if "id" in request.json:
        id = request.json["id"]
        user = Users.query.filter_by(id=id).first()
        if "abn" in request.json:
            user.abn = request.json["abn"]

        if "account_name" in request.json:
            user.account_name = request.json["account_name"]

        if "account_number" in request.json:
            user.account_number = request.json["account_number"]

        if "account_type" in request.json:
            user.account_type = request.json["account_type"]

        if "address" in request.json:
            user.address = request.json["address"]

        if "address_proof_img" in request.json:
            user.address_proof_img = request.json["address_proof_img"]

        if "agreement_img" in request.json:
            user.agreement_img = request.json["agreement_img"]

        if "bank_name" in request.json:
            user.bank_name = request.json["bank_name"]

        if "bsb" in request.json:
            user.bsb = request.json["bsb"]

        if "children_check_img" in request.json:
            user.children_check_img = request.json["children_check_img"]

        if "contact_no" in request.json:
            user.contact_no = request.json["contact_no"]

        if "email" in request.json:
            user.email = request.json["email"]

        if "name" in request.json:
            user.name = request.json["name"]

        if "passport_img" in request.json:
            user.passport_img = request.json["passport_img"]

        if "passport_number" in request.json:
            user.passport_number = request.json["passport_number"]

        if "password" in request.json:
            user.password = request.json["password"]

        if "police_check_img" in request.json:
            user.police_check_img = request.json["police_check_img"]

        if "verified" in request.json:
            user.verified = request.json["verified"]

        if "zip_code" in request.json:
            user.zip_code = request.json["zip_code"]

        db.session.commit()
        return usersObjToDictArr([user])

    else:
        return {"error": "id required"}, 400


@admin.route("/authorization-token")
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
