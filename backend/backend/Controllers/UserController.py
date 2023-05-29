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
from datetime import datetime, date
from backend.middlewares.AuthorizationMiddleware import AuthorizationRequired
from sqlalchemy.sql.operators import and_
from .. import app
from .AuthController import saveUserImage


user = Blueprint("user", __name__)


def calculate_time(started_time: str, ended_time: str, out_type: str = "int"):
    started_time = started_time[:-3]
    ended_time = ended_time[:-3]
    start = datetime.strptime(started_time, '%H:%M')
    end = datetime.strptime(ended_time, '%H:%M')
    duration = str(end - start)[:-3]
    if out_type == "str":
        return duration
    elif out_type == "int":
        hrs, mins = duration.split(":")
        hrs = int(hrs)
        mins = int(mins)/60
        duration = hrs+mins
        return duration


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


def get_day_txt():
    daysArr = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    today, _ = getTimeAndDate()
    year, month, day = today.split("-")
    year, month, day = int(year), int(month), int(day)
    dayIndex = date(year, month, day)
    return daysArr[dayIndex.weekday()]


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
        return jsonify(dict(user)), 200

    else:
        return {"message": "User not found"}, 400


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



@user.route("/update-documents", methods=["POST"])
@jwt_required()
def updateSingleUsers():
    usr = request.form
    usrImg = request.files

    usrID = usr["id"]

    address_proof_img = ""
    passport_img = ""
    police_check_img = ""
    children_check_img = ""
    agreement_img = ""
    declaration_img = ""

    if "address_proof_img" in usrImg:
        address_proof_img = saveUserImage(usrImg["address_proof_img"], usrID, "address_proof_img")
    
    if "passport_img" in usrImg:
        passport_img = saveUserImage(usrImg["passport_img"], usrID, "passport_img")

    if "police_check_img" in usrImg:
        police_check_img = saveUserImage(usrImg["police_check_img"], usrID, "police_check_img")
    
    if "children_check_img" in usrImg:
        children_check_img = saveUserImage(usrImg["children_check_img"], usrID, "children_check_img")
    
    if "agreement_img" in usrImg:
        agreement_img = saveUserImage(usrImg["agreement_img"], usrID, "agreement_img")

    if "declaration_img" in usrImg:
        declaration_img = saveUserImage(
            usrImg["declaration_img"], usrID, "declaration_img")

    return jsonify({})



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

        user_quick_jobs:list = userDict["quick_jobs"]

        for quickJob in user_quick_jobs:
            quickJobData = QuickJobs.query.filter_by(job_id=quickJob["job_id"]).first()
            job_date = quickJobData.job_date
            today_date, _ = getTimeAndDate()
            job_date = datetime.strptime(job_date, "%Y-%m-%d")
            today_date = datetime.strptime(today_date, "%Y-%m-%d")
            if job_date < today_date:
                userData = Users.query.filter_by(id=currentUserId).first()
                user_quick_jobs.remove(quickJob)
                userDict["quick_jobs"] = user_quick_jobs
                userData.quick_jobs = json.dumps(user_quick_jobs)
                db.session.commit()

        return jsonify(userDict), 200


@user.route("/get-permanent-jobs/<jobID>")
@jwt_required()
def get_a_permanent_job(jobID):
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    job_start_time = ""
    return_data = {
        "job_id": job_data.job_id,
        "job_name": job_data.job_name,
        "job_desc": job_data.job_desc,
        "job_payment_for_fortnight": job_data.job_payment_for_fortnight,
        # "job_payment_for_day": job_data.job_payment_for_day,
        "job_location": job_data.job_location,
        "job_start_time": job_start_time,
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

        job_started_date, job_started_time = getTimeAndDate()

        job_is_already_done = CompletedJobs.query.filter_by(
            job_id=job_id).filter_by(date=job_started_date).first()

        dayTXT = get_day_txt()

        pay_for_days = {
            'Mo': job_data.pey_per_mo,
            'Tu': job_data.pey_per_tu,
            'We': job_data.pey_per_we,
            'Th': job_data.pey_per_th,
            'Fr': job_data.pey_per_fr,
            'Sa': job_data.pey_per_sa,
            'Su': job_data.pey_per_su
        }
        job_payment_for_day = pay_for_days[dayTXT]

        jobTimeTable = json.loads(job_data.job_timetable)
        counts_per_day = 0

        for timeline in jobTimeTable:
            for dy in timeline["days"]:
                if dy == dayTXT:
                    counts_per_day += 1
        if job_is_already_done == None and counts_per_day > 0:
            counts_per_day -= 1
            user_data.current_permanent_job_row_id = started_job_id
            user_data.current_permanent_job_id = job_id
            started_job = CompletedJobs(
                id=started_job_id,
                user_id=user_id,
                user_name=user_data.name,
                job_id=job_id,
                job_name=job_data.job_name,
                started_time=job_started_time,
                ended_time="pending",
                date=job_started_date,
                job_payment_for_day=job_payment_for_day,
                job_status="pending",
                job_started_location=str(start_location),
                job_ended_location="",
                job_counts_per_day=counts_per_day
            )
            db.session.add(started_job)
            db.session.commit()
            return jsonify({"status": "done", "msg": "Job started", "started_row_id": started_job_id, "started_job_id": job_id})
        elif int(job_is_already_done.job_counts_per_day) > 0:
            user_data.current_permanent_job_row_id = job_is_already_done.id
            user_data.current_permanent_job_id = job_id
            available_counts_per_day = int(
                job_is_already_done.job_counts_per_day) - 1
            job_is_already_done.job_counts_per_day = str(
                available_counts_per_day)
            db.session.commit()
            return jsonify({"status": "done", "msg": "Job started", "started_row_id": job_is_already_done.id, "started_job_id": job_is_already_done.job_id})
        else:
            return jsonify({"status": "error", "msg": "You done jobs that you have left for day."})

    else:
        return jsonify({"status": "error", "msg": "You already have started job"})


@user.route("/stop-permanent-job", methods=["POST"])
@jwt_required()
def stop_permanent_job():
    data = request.json
    user_id = data["user_id"]
    row_id = data['row_id']
    finish_location = data["finish_location"]

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
        ret_data = {
            "job_id": job_data.job_id,
            "job_name": job_data.job_name,
            "job_desc": job_data.job_desc,
            # "job_duration": job_data.job_duration,
            "job_payment_for_fortnight": job_data.job_payment_for_fortnight,
            "job_location": job_data.job_location,
            "job_timetable": json.loads(job_data.job_timetable),
            # "job_enrolled_ids": json.loads(job_data.job_enrolled_ids),
        }
        return jsonify(ret_data)
    return jsonify({"status": "enrolled", "job_id": job_id})


@user.route("/check-is-req-for-permanent-job", methods=["POST"])
@jwt_required()
def check_is_req_for_permanent_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data["job_id"]

    check_already_requested = JobRequests.query.filter(
        and_(
            JobRequests.user_id == user_id,
            JobRequests.job_id == job_id
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

    check_already_requested = JobRequests.query.filter(
        and_(
            JobRequests.user_id == user_id,
            JobRequests.job_id == job_id
        )
    ).all()

    if len(check_already_requested) == 0:
        req_id = str(uuid4())
        new_req = JobRequests(
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
                # "duration": doneJob.job_duration,
                "payment": f"{float(str(doneJob.job_payment_for_day).split('-')[0]):.02f}"
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


@user.route("/get-duration-start-time", methods=["POST"])
@jwt_required()
def get_duration_start_time():
    data = request.json
    job_id = data["job_id"]

    jobData = PermanentJobs.query.filter_by(job_id=job_id).first()
    start_times = []
    timeTable = json.loads(jobData.job_timetable)

    todayTxt = get_day_txt()
    for timeline in timeTable:
        for dy in timeline["days"]:
            if todayTxt == dy:
                start_times.append(timeline["time"])

    return jsonify(start_times)


@user.route("/get-all-quick-jobs")
def get_all_quick_jobs():
    get_all_jobs = QuickJobs.query.filter_by(job_available="true").all()
    allJobs = []

    for job in get_all_jobs:
        enrolled_IDs = json.loads(job.job_enrolled_ids)
        need_count = int(job.job_need_count)
        today_date, _ = getTimeAndDate()
        job_date = job.job_date
        today_date = datetime.strptime(today_date, "%Y-%m-%d")
        job_date = datetime.strptime(job_date, "%Y-%m-%d")
        if today_date<=job_date:
            if len(enrolled_IDs) < need_count:
                allJobs.append({
                    "job_id": job.job_id,
                    "job_name": job.job_name,
                    "job_desc": job.job_desc,
                    "job_location": job.job_location,
                    "job_start_time": job.job_start_time,
                    "job_date": job.job_date,
                    "pay_per_hr_for_c": job.pay_per_hr_for_c,
                    "pay_per_hr_for_me": job.pay_per_hr_for_me,
                    "job_enrolled_ids": enrolled_IDs,
                    "job_need_count": need_count,
                    "job_available": job.job_available,
                })

    return jsonify(allJobs)


@user.route("/quick-job-data/<jobID>")
def get_quick_job_data(jobID):
    # print(jobID)
    get_job_id = QuickJobs.query.filter_by(job_id=jobID).first()
    if get_job_id:
        job_data = {
            "job_id": get_job_id.job_id,
            "job_name": get_job_id.job_name,
            "job_desc": get_job_id.job_desc,
            "job_location": get_job_id.job_location,
            "job_start_time": get_job_id.job_start_time,
            "job_date": get_job_id.job_date,
            "pay_per_hr_for_c": get_job_id.pay_per_hr_for_c,
            # "pay_per_hr_for_me":get_job_id.pay_per_hr_for_me,
            # "job_enrolled_ids":json.loads(get_job_id.job_enrolled_ids),
            "job_need_count": get_job_id.job_need_count,
            "job_available": get_job_id.job_available,
        }
        return jsonify(job_data)
    else:
        return jsonify({"status": "error"})


@user.route('/start-quick-job', methods=["POST"])
@jwt_required()
def start_quick_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data['job_id']
    start_location = data["start_location"]

    user_data = Users.query.filter_by(id=user_id).first()

    if user_data.current_quick_job_id == "empty":
        job_data = QuickJobs.query.filter_by(job_id=job_id).first()

        started_job_id = str(uuid4())

        job_started_date, job_started_time = getTimeAndDate()

        done_jobs = CompletedJobs.query.filter_by(job_id=job_id).all()

        for done_quick_job in done_jobs:
            if user_data.id == done_quick_job.user_id:
                return jsonify({"status": "error", "msg": "You done jobs that you have left for day."})

        job_payment_for_day = "--.--"

        counts_per_day = int(job_data.job_need_count)

        if len(done_jobs) < counts_per_day:
            user_data.current_quick_job_row_id = started_job_id
            user_data.current_quick_job_id = job_id
            # counts_per_day = str(counts_per_day-1)
            started_job = CompletedJobs(
                id=started_job_id,
                user_id=user_id,
                user_name=user_data.name,
                job_id=job_id,
                job_name=job_data.job_name,
                started_time=job_started_time,
                ended_time="pending",
                date=job_started_date,
                job_payment_for_day=job_payment_for_day,
                job_status="pending",
                job_started_location=str(start_location),
                job_ended_location="",
                job_counts_per_day="1"
            )
            db.session.add(started_job)
            db.session.commit()
            return jsonify({"status": "done", "msg": "Job started", "started_row_id": started_job_id, "started_job_id": job_id})

        else:
            return jsonify({"status": "error", "msg": "You done jobs that you have left for day."})

    else:
        return jsonify({"status": "error", "msg": "You already have started job"})


@user.route("/stop-quick-job", methods=["POST"])
@jwt_required()
def stop_quick_job():
    data = request.json
    user_id = data["user_id"]
    row_id = data['row_id']
    finish_location = data["finish_location"]

    user_data = Users.query.filter_by(id=user_id).first()

    if user_data.current_quick_job_row_id == row_id:
        job_completed_row = CompletedJobs.query.filter_by(id=row_id).first()
        job_data = QuickJobs.query.filter_by(
            job_id=job_completed_row.job_id).first()
        job_ended_date, job_ended_time = getTimeAndDate()

        # job_ended_time = "19:35:00"
        pay_per_hr_for_c = int(job_data.pay_per_hr_for_c)
        pay_per_hr_for_me = int(job_data.pay_per_hr_for_me)
        duration = calculate_time(job_completed_row.started_time, job_ended_time)
        job_payment_for_day_c = float(duration * pay_per_hr_for_c)
        job_payment_for_day_me = float(duration * pay_per_hr_for_me)

        job_completed_row.ended_time = job_ended_time
        job_completed_row.job_status = "done"
        job_completed_row.job_counts_per_day = "0"
        job_completed_row.job_payment_for_day = f"{job_payment_for_day_c:.2f}-{job_payment_for_day_me:.2f}"
        job_completed_row.job_ended_location = str(finish_location)
        user_data.current_quick_job_id = "empty"
        user_data.current_quick_job_row_id = "empty"
        db.session.commit()

        return jsonify({"status": "done", "msg": "Job started", "started_row_id": "empty", "started_job_id": "empty"})

    else:
        return jsonify({"status": "error", "msg": "You have not started job"})
