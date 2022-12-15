from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from .models import User
from . import db
from .allFunctions import usersObjtoDictArr


auth = Blueprint("auth", __name__)

testusers = [
    {
        "id": str(uuid4()),
        "name": "kavindu",
        "address": "test address",
        "zip_code": "5092",
        "contact_no": "0451570655",
        "email": "test5@email.com",
        "abn": "test ABN number 5",
        "passport_number": "N9070656",
        "bank_name": "commonwealth",
        "account_type": "saving account",
        "account_name": "kavindu harshitha",
        "account_number": "64649505540",
        "bsb": "065000",
        "address_proof_img": "img/path",
        "passport_img": "img/path",
        "police_check_img": "img/path",
        "children_check_img": "img/path",
        "agreement_img": "img/path",
        "verified": "True",
        "password": str(uuid4()),
    },
    {
        "id": str(uuid4()),
        "name": "kavindu harshitha",
        "address": "test address",
        "zip_code": "5092",
        "contact_no": "0451570615",
        "email": "test1@email.com",
        "abn": "test ABN number 8",
        "passport_number": "N9070681",
        "bank_name": "commonwealth",
        "account_type": "saving account",
        "account_name": "kavindu harshitha",
        "account_number": "64649805541",
        "bsb": "065000",
        "address_proof_img": "img/path",
        "passport_img": "img/path",
        "police_check_img": "img/path",
        "children_check_img": "img/path",
        "agreement_img": "img/path",
        "verified": "True",
        "password": str(uuid4()),
    },
    {
        "id": str(uuid4()),
        "name": "kavindu boss",
        "address": "test address",
        "zip_code": "5092",
        "contact_no": "0451570625",
        "email": "test2@email.com",
        "abn": "test ABN number 9",
        "passport_number": "N9070626",
        "bank_name": "commonwealth",
        "account_type": "saving account",
        "account_name": "kavindu harshitha",
        "account_number": "64649805542",
        "bsb": "065000",
        "address_proof_img": "img/path",
        "passport_img": "img/path",
        "police_check_img": "img/path",
        "children_check_img": "img/path",
        "agreement_img": "img/path",
        "verified": "True",
        "password": str(uuid4()),
    },
]


def returnUsers(id=None):
    all_users = None
    if id == None:
        all_users = User.query.all()
    else:
        all_users = User.query.filter_by(id=id)
    return usersObjtoDictArr(all_users)


@auth.route("/login")
def login():
    return 'login'


@auth.route("/register", methods=['POST'])
def register():
    # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # users_dir = os.path.join(BASE_DIR, "users")
    file = request.files["passport_img"]
    filename = secure_filename(file.filename)
    # file.save(os.path.join(users_dir, filename))
    print(f"[SAVED] {filename}")
    print(request.form['name'])
    return "done"


@auth.route("/logout", methods=["POST"])
def logout():
    return 'logout'


@auth.route("/get", methods=["GET"])
def getUsers():
    all_users = returnUsers()

    return jsonify(all_users)


@auth.route("/get/user", methods=["POST"])
def getSingleUsers():
    if "id" in request.json:
        id = request.json["id"]
        all_users = returnUsers(id)
        return jsonify(all_users)

    else:
        return {"error": "id required"}, 400


@auth.route("/del/user", methods=["POST"])
def delSingleUsers():
    if "id" in request.json:
        id = request.json["id"]
        del_user = User.query.filter_by(id=id).delete()
        return "", 200

    else:
        return {"error": "id required"}, 400


@auth.route("/update/user", methods=["POST"])
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



# new_user = User(
#     id=uuid4(),
#     name=usr["name"],
#     address=usr["address"],
#     zip_code=usr["zip_code"],
#     contact_no=usr["contact_no"],
#     email=usr["email"],
#     abn=usr["abn"],
#     passport_number=usr["passport_number"],
#     bank_name=usr["bank_name"],
#     account_type=usr["account_type"],
#     account_name=usr["account_name"],
#     account_number=usr["account_number"],
#     bsb=usr["bsb"],
#     address_proof_img=usr["address_proof_img"],
#     passport_img=usr["passport_img"],
#     police_check_img=usr["police_check_img"],
#     children_check_img=usr["children_check_img"],
#     agreement_img=usr["agreement_img"],
#     verified=usr["verified"],
#     password=usr["password"]
# )


# usr["address_proof_img"] =
# usr["passport_img"] =
# usr["police_check_img"] =
# usr["children_check_img"] =
# usr["agreement_img"] =