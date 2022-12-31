from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..models import Users
from .. import db
from ..allFunctions import usersObjToDictArr, userObjToDict
from datetime import timedelta
from .. import BASE_DIR


auth = Blueprint("auth", __name__)


def getUserFromEmail(email):
    try:
        user = Users.query.filter_by(email=email).first()
        return user
    except:
        return False


def saveUserImage(file, userID, saveName):
    # users_dir = os.path.join(os.path.join(BASE_DIR, "img"), "users")
    users_dir = os.path.join(os.path.join(
        os.path.join(BASE_DIR, "Resources"), "img"), "users")
    user_folder = os.path.join(users_dir, str(userID))
    if not os.path.exists(user_folder):
        os.mkdir(user_folder)
    save_file_path = os.path.join(
        user_folder, f"{saveName}.{str(file.filename).split('.')[-1]}")
    file.save(save_file_path)
    return save_file_path


@auth.route("/login", methods=["POST"])
def login():
    user_data = request.json
    if "email" in user_data and "password" in user_data:
        user = getUserFromEmail(user_data["email"])
        if user:
            if check_password_hash(user.password, user_data["password"]):
                expires = timedelta(hours=24)
                access_token = create_access_token(
                    identity=user.id, expires_delta=expires)
                usrData = userObjToDict(user)
                return jsonify({"access_token": access_token, "user": usrData}), 200
            else:
                return jsonify("Something went wrong please check the credentials"), 401
        else:
            return jsonify("User not exist"), 404
    else:
        return jsonify("Fill all fields"), 404


@auth.route("/register", methods=['POST'])
def register():
    usr = request.form
    print(usr)
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


@auth.route("/logout", methods=["POST"])
def logout():
    return 'logout'


@auth.route("/authorization-token", methods=["POST"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200


# this route for testing purposes
@auth.route("/get-all")
def get_all_users():
    all_users = db.session.query(Users).all()
    return jsonify(usersObjToDictArr(all_users))
