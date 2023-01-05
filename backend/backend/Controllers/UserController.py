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
from ..Services.DbService import *
from ..allFunctions import userObjToDict, GetJwtFromRequest, CheckJwtBlacklisted
import json
from datetime import datetime


user = Blueprint("user", __name__)


def getTimeAndDate():
    today = str(datetime.now())
    started_date = today.split(" ")[0]
    started_time = today.split(" ")[1].split(".")[0]
    return started_date, started_time


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


@user.route("/users", methods=["GET"])
def getUsers():
    users = DbGetMany('Users')
    return jsonify(users), 200


@user.route("/user/<id>", methods=["GET"])
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


@user.route("/user", methods=["GET"])
@jwt_required()
def GetUser():
    jwt = GetJwtFromRequest(request)
    if (CheckJwtBlacklisted(jwt)):
        return jsonify("You already logged out. Unauthorized"), 401
    else:
        currentUserId = get_jwt_identity()
        user = DbGetOne('Users', 'id', currentUserId)
        if (user == None):
            return jsonify("Unauthorized"), 401

        userDict = userObjToDict(user, False)
        return jsonify(userDict), 200


@user.route("/get-permanent-jobs/<jobID>")
@jwt_required()
def get_a_permanent_job(jobID):
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    return_data = {
        "job_id": job_data.job_id,
        "job_name": job_data.job_name,
        "job_desc": job_data.job_desc,
        "job_duration": job_data.job_duration,
        "job_payment_for_fortnight": job_data.job_payment_for_fortnight,
        # "job_payment_for_day": job_data.job_payment_for_day,
        "job_location": job_data.job_location,
        "job_start_time": job_data.job_start_time,
        "job_timetable": json.loads(job_data.job_timetable),
        # "job_enrolled_ids": json.loads(job_data.job_enrolled_ids),
    }
    return jsonify(return_data)


@user.route('/start-permanent-job', methods=["POST"])
@jwt_required()
def start_permanent_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data['job_id']

    user_data = Users.query.filter_by(id=user_id).first()

    if user_data.current_permanent_job_id == "empty":
        job_data = PermanentJobs.query.filter_by(job_id=job_id).first()

        started_job_id = str(uuid4())
        user_data.current_permanent_job_row_id = started_job_id
        user_data.current_permanent_job_id = job_id

        job_started_date, job_started_time = getTimeAndDate()

        started_job = CompletedJobs(
            id=started_job_id,
            user_id=user_id,
            user_name=user_data.name,
            job_id=job_id,
            job_name=job_data.job_name,
            started_time=job_started_time,
            ended_time="pending",
            date=job_started_date,
            job_payment_for_day=job_data.job_payment_for_day,
            job_status="pending",
            job_started_location="",
            job_ended_location="",
            job_duration=job_data.job_duration
        )
        db.session.add(started_job)
        db.session.commit()

        return jsonify({"status": "done", "msg": "Job started", "started_row_id": started_job_id, "started_job_id": job_id})

    else:
        return jsonify({"status": "error", "msg": "You already have started job"})


@user.route("/stop-permanent-job", methods=["POST"])
@jwt_required()
def stop_permanent_job():
    data = request.json
    user_id = data["user_id"]
    row_id = data['row_id']

    user_data = Users.query.filter_by(id=user_id).first()

    if user_data.current_permanent_job_row_id == row_id:
        job_completed_row = CompletedJobs.query.filter_by(id=row_id).first()
        job_ended_date, job_ended_time = getTimeAndDate()

        job_completed_row.ended_time = job_ended_time
        job_completed_row.job_status = "done"

        user_data.current_permanent_job_id = "empty"
        user_data.current_permanent_job_row_id = "empty"

        db.session.commit()

        return jsonify({"status": "done", "msg": "Job started", "started_row_id": "empty", "started_job_id": "empty"})

    else:
        return jsonify({"status": "error", "msg": "You have not started job"})


# this route for testing purposes
@user.route("/get-all-permanent-job-workings")
def get_all_permanent_job_workings():
    all_jobs = db.session.query(CompletedJobs).all()
    allJobs = []
    for job in all_jobs:
        allJobs.append({
            "id": job.id,
            "user_id": job.user_id,
            "user_name": job.user_name,
            "job_id": job.job_id,
            "job_name": job.job_name,
            "started_time": job.started_time,
            "ended_time": job.ended_time,
            "date": job.date,
            "job_payment_for_day": job.job_payment_for_day,
            "job_status": job.job_status,
            "job_started_location": job.job_started_location,
            "job_ended_location": job.job_ended_location,
            "job_duration": job.job_duration,
        })
    return jsonify(allJobs)
