from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..models import Users
from .. import db
from ..allFunctions import usersObjToDictArr
from datetime import timedelta
from ..Services.DbService import *

user = Blueprint("user", __name__)


# def returnUsers(id=None):
#     all_users = None
#     if id == None:
#         all_users = Users.query.all()
#     else:
#         all_users = Users.query.filter_by(id=id)
#     return usersObjToDictArr(all_users)


# def getUserFromEmail(email):
#     try:
#         user = Users.query.filter_by(email=email).first()
#         return user
#     except:
#         return False


@user.route("/users", methods=["GET"])
def getUsers():
    users = DbGetMany('Users')
    return jsonify(users), 200


@user.route("/get/<id>", methods=["GET"])
def getSingleUsers(id):
    if (id):
        user = DbGetOne('Users', 'id', id)
        return jsonify(user), 200

    else:
        return {"error": "id required"}, 400


@user.route("/user/<id>", methods=["DELETE"])
def delSingleUsers(id):
    id = request.json["id"]
    if (id):
        try:
            DbDelMany('Users', 'id', id)
            return {}, 200
        except:
            return {'error': 'Error ocurred !'}, 500

    else:
        return {"error": "id required"}, 400


'''
@user.route("/update/user", methods=["POST"])
def updateSingleUsers():
    if "id" in request.json:
        id = request.json["id"]
        user = User.query.filter_by(id=id).first()
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
        return usersObjtoDictArr([user])

    else:
        return {"error": "id required"}, 400
'''
