import re
from .Services.DbService import DbGetOne
import json
from flask import url_for, g
from flask_jwt_extended import jwt_required, get_jwt_identity


def imgPath(cur_path=""):
    new_path = cur_path.split("/var/www/whonear.xyz/backend/backend")
    new_path = '/api'.join(new_path[-1])
    return new_path


def userObjToDict(obj, isPw=False):
    if (obj == None):
        return None

    if isPw:
        return {
            "id": str(obj.id),
            "name": str(obj.name),
            "role": str(obj.role),
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

            "current_permanent_job_row_id": str(obj.current_permanent_job_row_id),
            "current_quick_job_row_id": str(obj.current_quick_job_row_id),
            "current_permanent_job_id": str(obj.current_permanent_job_id),
            "current_quick_job_id": str(obj.current_quick_job_id),
        }

    return {
        "id": str(obj.id),
        "name": str(obj.name),
        "role": str(obj.role),
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

        "current_permanent_job_row_id": str(obj.current_permanent_job_row_id),
        "current_quick_job_row_id": str(obj.current_quick_job_row_id),
        "current_permanent_job_id": str(obj.current_permanent_job_id),
        "current_quick_job_id": str(obj.current_quick_job_id),
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


def convert_coordinates(location: str):
    lat, lon = location.split(",")
    lat, lon = float(lat), float(lon)

    lat_deg = int(lat)
    lat_min = int((lat - lat_deg) * 60)
    lat_sec = int((((lat - lat_deg) * 60) - lat_min) * 60)

    lon_deg = int(lon)
    lon_min = int((lon - lon_deg) * 60)
    lon_sec = int((((lon - lon_deg) * 60) - lon_min) * 60)

    return f"{abs(lat_deg)}°{abs(lat_min)}'{abs(lat_sec)}\"S+{abs(lon_deg)}°{abs(lon_min)}'{abs(lon_sec)}\"E"
