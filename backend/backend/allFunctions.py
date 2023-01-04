import re
from .Services.DbService import DbGetOne
import json
from flask import url_for


def imgPath(cur_path=""):
    new_path = cur_path.split("\\")
    print(cur_path)
    # print(new_path)
    new_path = "/".join(new_path[-4:])
    # print(new_path)
    new_path = url_for('static', filename=new_path, _external=True)
    print(new_path)
    print("")
    return new_path


def userObjToDict(obj, isPw=False):
    if (obj == None):
        return None

    if isPw:
        return {
            "id": str(obj.id),
            "name": str(obj.name),
            "address": str(obj.address),
            "zip_code": str(obj.zip_code),
            "contact_no": str(obj.contact_no),
            "email": str(obj.email),
            "abn": str(obj.abn),
            "passport_number": str(obj.passport_number),
            "bank_name": str(obj.bank_name),
            "account_type": str(obj.account_type),
            "account_name": str(obj.account_name),
            "account_number": str(obj.account_number),
            "bsb": str(obj.bsb),

            "address_proof_img": imgPath(str(obj.address_proof_img)),
            "passport_img": imgPath(str(obj.passport_img)),
            "police_check_img": imgPath(str(obj.police_check_img)),
            "children_check_img": imgPath(str(obj.children_check_img)),
            "agreement_img": imgPath(str(obj.agreement_img)),

            "verified": str(obj.verified),
            "password": str(obj.password),
            "permanent_jobs": json.loads(obj.permanent_jobs),
            "quick_jobs": json.loads(obj.quick_jobs),
            "current_job_id": str(obj.current_job_id)
        }

    return {
        "id": str(obj.id),
        "name": str(obj.name),
        "address": str(obj.address),
        "zip_code": str(obj.zip_code),
        "contact_no": str(obj.contact_no),
        "email": str(obj.email),
        "abn": str(obj.abn),
        "passport_number": str(obj.passport_number),
        "bank_name": str(obj.bank_name),
        "account_type": str(obj.account_type),
        "account_name": str(obj.account_name),
        "account_number": str(obj.account_number),
        "bsb": str(obj.bsb),

        "address_proof_img": imgPath(str(obj.address_proof_img)),
        "passport_img": imgPath(str(obj.passport_img)),
        "police_check_img": imgPath(str(obj.police_check_img)),
        "children_check_img": imgPath(str(obj.children_check_img)),
        "agreement_img": imgPath(str(obj.agreement_img)),

        "verified": str(obj.verified),
        "permanent_jobs": json.loads(obj.permanent_jobs),
        "quick_jobs": json.loads(obj.quick_jobs),
        "current_job_id": str(obj.current_job_id)
    }


def usersObjToDictArr(objarr):
    allUsers = []
    for usr in objarr:
        tmp = userObjToDict(usr, True)
        allUsers.append(tmp)
    return allUsers


def txtValidation(txt, typeOfTxt):
    if typeOfTxt == "email":
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.findall(regex, txt):
            return True
        else:
            return False

    elif typeOfTxt == "azs":
        regex = r'[a-z\s]*'
        if re.fullmatch(regex, txt):
            return True
        else:
            return False

    elif typeOfTxt == "09":
        if len(txt) == 10:
            regex = r'[0-9]*'
            if re.fullmatch(regex, txt):
                return True
            else:
                return False
        else:
            return False

    elif typeOfTxt == "desc":
        if len(txt) == 10:
            regex = r'[a-z|0-9\s]*'
            if re.fullmatch(regex, txt):
                return True
            else:
                return False
        else:
            return False


def GetJwtFromRequest(request):
    authHeader = request.headers.get('Authorization')
    jwt = authHeader.split(' ', 1)[1]
    return jwt


def CheckJwtBlacklisted(jwt):
    jwtFound = DbGetOne('BlacklistedAccessTokens', 'access_token', jwt)
    if (jwtFound == None):
        return False
    else:
        return True
