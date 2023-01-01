from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..Models import Users
from .. import db
from ..allFunctions import usersObjToDictArr
from datetime import timedelta


admin = Blueprint("admin", __name__)


@admin.route("/create-permanent-job", methods=["POST"])
def create_permanent_job():
    allItemsFromForm = []
    must_have = [
        "job_title",
        "job_address",
        "duration_hrs",
        "duration_mins",
        "job_description",
        "start_time",
        "end_time",
    ]
    days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]
    for itm in must_have:
        if itm not in request.form:
            return jsonify({"status": "error", "msg": "Details missing"})

    for itm in request.form:
        print(itm)
        allItemsFromForm.append(itm)

    for itm in must_have:
        if itm in allItemsFromForm:
            allItemsFromForm.remove(itm)

    if len(allItemsFromForm) == 0:
        return jsonify({"status": "error", "msg": "You havent selected any day for the job"})

    return ""
