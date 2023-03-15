from flask import Blueprint, request, jsonify, Response
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..Models import Users
from .. import db
from .. import logger
from sqlalchemy import select
from ..allFunctions import usersObjToDictArr, userObjToDict, GetJwtFromRequest
from datetime import timedelta
from .. import BASE_DIR
from ..Services.DbService import DbAddMany
from ..Models import BlacklistedAccessTokens
import json


auth = Blueprint("auth", __name__)


def getUserFromEmail(email):
    try:
        user = db.session.query(Users).filter(Users.email.like(email)).first()
        return user
    except Exception as e:
        print(e)
        return False


def saveUserImage(file, userID, saveName):
    # users_dir = os.path.join(os.path.join(BASE_DIR, "img"), "users")
    path_static = os.path.join(BASE_DIR, "static")
    path_static_img = os.path.join(path_static, "img")
    path_static_img_users = os.path.join(path_static_img, "users")

    if not os.path.exists(path_static):
        os.mkdir(path_static)

    if not os.path.exists(path_static_img):
        os.mkdir(path_static_img)

    if not os.path.exists(path_static_img_users):
        os.mkdir(path_static_img_users)

    users_dir = path_static_img_users
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
                expires = timedelta(days=7)
                access_token = create_access_token(
                    identity=user.id, expires_delta=expires)
                usrData = userObjToDict(user)
                return jsonify({"access_token": access_token, "user": usrData})
            else:
                return jsonify("Something went wrong please check the credentials"), 401
        else:
            return jsonify("User not exist"), 404
    else:
        return jsonify("Fill all fields"), 404


@auth.route("/register", methods=['POST'])
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
        role="user",
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
        permanent_jobs=json.dumps([]),
        quick_jobs=json.dumps([]),
        verified="false",
        password=generate_password_hash(usr["password"]).decode('utf-8'),
        current_permanent_job_row_id="empty",
        current_quick_job_row_id="empty",
        current_permanent_job_id="empty",
        current_quick_job_id="empty",
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return 'Ok', 200
    except Exception as e:
        return f'Error. Check wether this details have a account already. If error exist ever, please contact the owner', 400


@auth.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jwt = GetJwtFromRequest(request)
    blackListingToken = BlacklistedAccessTokens(access_token=jwt)
    try:
        DbAddMany([blackListingToken])
        return jsonify("Logged out."), 200
    except Exception as e:
        return jsonify("Already logged out."), 400


# this route for testing purposes
@auth.route("/get-all")
def get_all_users():
    return "ok", 200
    # all_users = db.session.query(Users).all()
    # return jsonify(usersObjToDictArr(all_users))
