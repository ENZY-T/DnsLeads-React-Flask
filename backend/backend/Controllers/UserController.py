from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
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
from backend.middlewares.AuthorizationMiddleware import AuthorizationRequired
from sqlalchemy.sql.operators import and_
from .. import app


user = Blueprint("user", __name__)


def getTimeAndDate():
    today = str(datetime.now())
    started_date = today.split(" ")[0]
    started_time = today.split(" ")[1].split(".")[0]
    # started_date = "2024-02-08"

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
    start_location = data["start_location"]

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
            job_started_location=str(start_location),
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
    finish_location = data["finish_location"]

    print(data)

    user_data = Users.query.filter_by(id=user_id).first()

    if user_data.current_permanent_job_row_id == row_id:
        job_completed_row = CompletedJobs.query.filter_by(id=row_id).first()
        job_ended_date, job_ended_time = getTimeAndDate()

        job_completed_row.ended_time = job_ended_time
        job_completed_row.job_status = "done"
        job_completed_row.job_ended_location = str(finish_location)

        user_data.current_permanent_job_id = "empty"
        user_data.current_permanent_job_row_id = "empty"

        db.session.commit()

        return jsonify({"status": "done", "msg": "Job started", "started_row_id": "empty", "started_job_id": "empty"})

    else:
        return jsonify({"status": "error", "msg": "You have not started job"})


@user.route("/get-all-permanent-jobs", methods=["POST"])
@jwt_required()
def get_all_permanent_jobs():
    userID = request.json["userID"]
    all_jobs = db.session.query(PermanentJobs).all()
    allJobs = []

    for job in all_jobs:
        userIn = False
        json_loaded_enrolled_data = json.loads(job.job_enrolled_ids)
        for user_id in json_loaded_enrolled_data:
            if user_id['id'] == userID:
                userIn = True
                break
        if int(job.job_need_count) > len(json_loaded_enrolled_data):
            if userIn == False:
                allJobs.append({
                    "job_id": job.job_id,
                    "job_name": job.job_name,
                    # "job_desc": job.job_desc,
                    "job_duration": job.job_duration,
                    "job_payment_for_fortnight": job.job_payment_for_fortnight,
                    # "job_payment_for_day": job.job_payment_for_day,
                    "job_location": job.job_location,
                    "job_start_time": job.job_start_time,
                    # "job_timetable": json.loads(job.job_timetable),
                    # "job_enrolled_ids": json.loads(job.job_enrolled_ids),
                })

    return jsonify(allJobs)


@user.route("/get-permanent-job", methods=["POST"])
@jwt_required()
def get_permanent_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data["job_id"]

    user_data = Users.query.filter_by(id=user_id).first()
    job_data = PermanentJobs.query.filter_by(job_id=job_id).first()

    is_user_enrolled = False
    json_loaded_enrolled_data = json.loads(job_data.job_enrolled_ids)
    for id_obj in json_loaded_enrolled_data:
        if id_obj["id"] == user_id:
            is_user_enrolled = True
            break

    if int(job_data.job_need_count) == len(json_loaded_enrolled_data):
        return jsonify({"status": "not-available"})

    if is_user_enrolled == False:
        return jsonify({
            "job_id": job_data.job_id,
            "job_name": job_data.job_name,
            "job_desc": job_data.job_desc,
            "job_duration": job_data.job_duration,
            "job_payment_for_fortnight": job_data.job_payment_for_fortnight,
            "job_payment_for_day": job_data.job_payment_for_day,
            "job_location": job_data.job_location,
            "job_start_time": job_data.job_start_time,
            "job_timetable": json.loads(job_data.job_timetable),
            # "job_enrolled_ids": json.loads(job_data.job_enrolled_ids),
        })
    return jsonify({"status": "enrolled", "job_id": job_id})


@user.route("/check-is-req-for-permanent-job", methods=["POST"])
@jwt_required()
def check_is_req_for_permanent_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data["job_id"]

    check_already_requested = PermanentJobRequests.query.filter(
        and_(
            PermanentJobRequests.user_id == user_id,
            PermanentJobRequests.job_id == job_id
        )
    ).all()

    if len(check_already_requested) == 0:
        return jsonify({"status": "not-enrolled"})
    else:
        return jsonify({"status": "enrolled"})


@user.route("/req-for-permanent-job", methods=["POST"])
@jwt_required()
def req_for_permanent_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data["job_id"]

    check_already_requested = PermanentJobRequests.query.filter(
        and_(
            PermanentJobRequests.user_id == user_id,
            PermanentJobRequests.job_id == job_id
        )
    ).all()

    if len(check_already_requested) == 0:
        req_id = str(uuid4())
        new_req = PermanentJobRequests(
            id=req_id,
            job_id=job_id,
            user_id=user_id
        )
        try:
            db.session.add(new_req)
            db.session.commit()
            return "done"
        except RuntimeError as e:
            return str(e), 500
    else:
        return jsonify({"status": "error", "msg": "You have already requested for this job"})


@user.route("/get-job-data-to-time", methods=["POST"])
@jwt_required()
def get_job_data_to_time():
    data = request.json
    user_id = data["user_id"]
    current_year = int(data["year"])
    current_month = int(data["month"])

    all_done_jobs = CompletedJobs.query.filter_by(user_id=user_id).all()
    allDoneJobs = []

    for doneJob in all_done_jobs:
        year, month, day = doneJob.date.split("-")
        if str(year) == str(current_year) and str(month) == f"{current_month:02d}":
            allDoneJobs.append({
                "date": doneJob.date,
                "place": doneJob.job_name,
                "duration": doneJob.job_duration,
                "payment": f"{float(doneJob.job_payment_for_day):.02f}"
            })

    return jsonify(allDoneJobs)


@user.route("/change-pw", methods=["POST"])
@jwt_required()
def change_pw():
    data = request.form
    current_password = data["current_password"]
    new_password = data["new_password"]
    confirm_password = data["confirm_password"]
    user_id = data['user_id']

    if current_password == "" or new_password == "" or confirm_password == "":
        return jsonify({"status": "error", "msg": "Empty fields. Please fill all fields."})

    user_data = Users.query.filter_by(id=user_id).first()
    if check_password_hash(user_data.password, current_password):
        if new_password != confirm_password:
            return jsonify({"status": "error", "msg": "New password and confirmation not match."})

        else:
            user_data.password = generate_password_hash(
                new_password).decode('utf-8')
            db.session.commit()
            return jsonify({"status": "done", "msg": "Password changed successfuly"})

    else:
        return jsonify({"status": "error", "msg": "Entered Current password wrong"})


############ from here all routes for testing ############
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


@user.route("/del-complete-job/<rowID>")
def del_complete_job(rowID):
    job_completed_row = CompletedJobs.query.filter_by(id=rowID).first()
    db.session.delete(job_completed_row)
    db.session.commit()
    return f"deleted {rowID}"


# Authorize whole user blueprint
# @user.before_request
@AuthorizationRequired('user')
def before_request():
    pass


# Testing route
@user.route("/user/test")
def GetAdmin():
    return "Success", 200
