from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..Models import Users, PermanentJobs, CompletedJobs, PermanentJobRequests
from .. import db
from ..allFunctions import usersObjToDictArr, userObjToDict, convert_coordinates
from datetime import timedelta
import json
from datetime import datetime
from sqlalchemy.sql.operators import and_
from ..middlewares.AuthorizationMiddleware import AuthorizationRequired


admin = Blueprint("admin", __name__)


@admin.route("/create-permanent-job", methods=["POST"])
def create_permanent_job():
    formData = request.form
    working_day_count = 0
    allItemsFromForm = []
    must_have = [
        "job_title",
        "job_address",
        "job_description",
        "start_time",
        "end_time",
        "payment_per_fortnight",
        "job_need_count",
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
        if itm not in formData:
            return jsonify({"status": "error", "msg": "Details missing"})
        else:
            if formData[itm] == "":
                empty_field = ' '.join(itm.split('_')).capitalize()
                return jsonify({"status": "error", "msg": f"{empty_field} cannot be empty"})

    for itm in formData:
        allItemsFromForm.append(itm)

    for itm in must_have:
        if itm in allItemsFromForm:
            allItemsFromForm.remove(itm)

    if len(allItemsFromForm) == 0:
        return jsonify({"status": "error", "msg": "You havent selected any day for the job"})

    daysForTimeTable = []

    for day in days:
        if day not in allItemsFromForm:
            daysForTimeTable.append("")
        else:
            daysForTimeTable.append(day[:2].capitalize())
            working_day_count += 1

    t1 = datetime.strptime(formData[must_have[3]], "%H:%M")
    t2 = datetime.strptime(formData[must_have[4]], "%H:%M")

    job_id = str(uuid4())
    job_name = formData[must_have[0]]
    job_desc = formData[must_have[2]]
    job_duration = f"{t2-t1}"[:-3]
    job_duration = job_duration.split(" ")[-1]
    job_payment_for_fortnight = formData[must_have[5]]
    job_payment_for_day = int(formData[must_have[5]])/(working_day_count*2)
    job_location = formData[must_have[1]]
    job_start_time = formData[must_have[3]]
    job_enrolled_ids = json.dumps([])
    job_need_count = formData[must_have[6]]

    end_time = formData[must_have[4]]

    timeTable = [
        {
            "time": f"{formData[must_have[3]]}-{end_time}",
            "days": daysForTimeTable
        }
    ]

    job_timetable = json.dumps(timeTable)

    new_job = PermanentJobs(
        job_id=job_id,
        job_name=job_name,
        job_desc=job_desc,
        job_duration=job_duration,
        job_payment_for_fortnight=job_payment_for_fortnight,
        job_payment_for_day=job_payment_for_day,
        job_location=job_location,
        job_start_time=job_start_time,
        job_timetable=job_timetable,
        job_enrolled_ids=job_enrolled_ids,
        job_need_count=job_need_count
    )

    try:
        db.session.add(new_job)
        db.session.commit()
        print(f"[DONE] Job Created Successfully\n[ID] {job_id}")
        return jsonify({"status": "done", "msg": "Job Created Successful"})
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)})


@admin.route("/get-permanent-jobs")
def get_permanent_jobs():
    all_jobs = db.session.query(PermanentJobs).all()
    return_data = []
    for jb in all_jobs:
        return_data.append({
            "job_id": jb.job_id,
            "job_name": jb.job_name,
            "job_desc": jb.job_desc,
            "job_duration": jb.job_duration,
            "job_payment_for_fortnight": jb.job_payment_for_fortnight,
            "job_payment_for_day": jb.job_payment_for_day,
            "job_location": jb.job_location,
            "job_start_time": jb.job_start_time,
            "job_timetable": json.loads(jb.job_timetable),
            "job_enrolled_ids": json.loads(jb.job_enrolled_ids),
        })
    return jsonify(return_data)


@admin.route("/get-permanent-jobs/<jobID>")
def get_a_permanent_job(jobID):
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    return_data = {
        "job_id": job_data.job_id,
        "job_name": job_data.job_name,
        "job_desc": job_data.job_desc,
        "job_duration": job_data.job_duration,
        "job_payment_for_fortnight": job_data.job_payment_for_fortnight,
        "job_payment_for_day": job_data.job_payment_for_day,
        "job_location": job_data.job_location,
        "job_start_time": job_data.job_start_time,
        "job_timetable": json.loads(job_data.job_timetable),
        "job_enrolled_ids": json.loads(job_data.job_enrolled_ids),
    }
    return jsonify(return_data)


@admin.route("/add-or-remove-user-to-permanent-job", methods=["POST"])
def add_user_to_permanent_job():
    data = request.json
    if "id" not in data or "added_id" not in data or "added_name" not in data or "method" not in data:
        return jsonify({"status": "error", "msg": "Details missing"})

    method = data["method"]
    job_id = data["id"]
    user_id = data["added_id"]
    added_user_name = data["added_name"]

    job_data = PermanentJobs.query.filter_by(job_id=job_id).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))

    get_user = Users.query.filter_by(id=user_id).first()
    permanent_job_list = list(json.loads(get_user.permanent_jobs))

    if method == "add":
        users_arr.append({"id": user_id, "name": added_user_name})
        permanent_job_list.append({
            "job_id": job_id,
            "job_name": job_data.job_name,
            "job_location": job_data.job_location,
            "job_start_time": job_data.job_start_time,
            "job_duration": job_data.job_duration
        })

    elif method == "remove":
        for usr in users_arr:
            if usr["id"] == user_id:
                users_arr.pop(users_arr.index(usr))
                break

        for jb in permanent_job_list:
            if jb["job_id"] == job_id:
                permanent_job_list.pop(permanent_job_list.index(jb))
                break

    job_data.job_enrolled_ids = json.dumps(users_arr)
    get_user.permanent_jobs = json.dumps(permanent_job_list)

    db.session.commit()
    return jsonify(users_arr)


@admin.route("/get-contractors", methods=["POST"])
def get_all_contractors():
    jobID = request.json['jobID']
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))
    all_users = Users.query.filter_by(role="user").all()
    allUsers = []
    for usr in all_users:
        to_append = {
            "id": usr.id,
            "name": usr.name
        }
        if to_append not in users_arr:
            allUsers.append(to_append)

    return jsonify(allUsers)


@admin.route("/get-all-sub-contractors")
def get_all_contractors_to_show():
    all_users = Users.query.filter_by(role="user").all()
    allUsers = []
    for usr in all_users:
        to_append = {
            "id": usr.id,
            "name": usr.name
        }
        allUsers.append(to_append)

    return jsonify(allUsers)


@admin.route("/get-contractor/<userID>")
def get_single_contractor(userID):
    user_data = Users.query.filter_by(id=userID).first()
    return userObjToDict(user_data)


@admin.route("/remove-subcontractor/<userID>")
@AuthorizationRequired('admin')
def remove_subcontractor(userID):
    get_user = Users.query.filter_by(id=userID).first()
    db.session.delete(get_user)
    db.session.commit()
    return "done"


@admin.route("/verify-user", methods=["POST"])
def verify_user():
    data = request.json
    use_data = Users.query.filter_by(id=data["id"]).first()

    return_state = ""
    if "method" in data:
        method = data["method"]
        if method == "approve":
            use_data.verified = "true"
            return_state = "approve"
        elif method == "disprove":
            use_data.verified = "false"
            return_state = "disprove"
        db.session.commit()
    else:
        return_state = use_data.verified

    return jsonify(return_state)


@admin.route("/get-done-jobs-by-place", methods=["POST"])
def get_done_jobs_by_place():
    data = request.json
    job_id = data["job_id"]
    filter_by_year = data['year']
    filter_by_month = int(data['month'])

    print(f"{filter_by_year}-{filter_by_month}")

    job_datas = CompletedJobs.query.filter_by(job_id=job_id).all()
    jobDatas = []

    def locationLink(locationtxt):
        converted = convert_coordinates(locationtxt)
        return f"https://www.google.com.au/maps/place/{converted}/@{locationtxt}/"

    for job in job_datas:
        year, month, date = job.date.split("-")
        if str(year) == str(filter_by_year) and str(month) == f"{filter_by_month:02d}":
            end_location = ""
            if job.job_ended_location != "":
                end_location = locationLink(job.job_ended_location)

            job_real_times = PermanentJobs.query.filter_by(
                job_id=job.job_id).first()

            job_duration = job.job_duration.split(":")
            must_end_time = datetime.strptime(job_real_times.job_start_time, '%H:%M') + timedelta(
                hours=int(job_duration[0]), minutes=int(job_duration[1]))
            must_end_time = must_end_time.strftime("%H:%M")
            took_duration = ""
            if job.ended_time != "pending":
                took_duration = datetime.strptime(
                    job.ended_time, "%H:%M:%S") - datetime.strptime(job.started_time, "%H:%M:%S")

            jobDatas.append({
                "id": job.id,
                "user_id": job.user_id,
                "user_name": job.user_name,
                "job_id": job.job_id,
                "job_name": job.job_name,
                "started_time": job.started_time[:-3],
                "ended_time": job.ended_time[:-3],
                "date": job.date,
                "job_payment_for_day": job.job_payment_for_day,
                "job_status": job.job_status,
                "job_started_location": locationLink(job.job_started_location),
                "job_ended_location": end_location,
                "job_duration": str(took_duration)[:-3],
                "must_time": {
                    "start_time": job_real_times.job_start_time,
                    "end_time": str(must_end_time),
                    "duration": job.job_duration
                }
            })

    return jsonify(jobDatas)


@admin.route("/get-req-count", methods=["POST"])
def get_req_count():
    job_id = request.json["job_id"]
    return str(len(PermanentJobRequests.query.filter_by(job_id=job_id).all()))


@admin.route("/get-all-req-users", methods=["POST"])
def get_all_req_users():
    job_id = request.json["job_id"]
    all_reqs = PermanentJobRequests.query.filter_by(job_id=job_id).all()
    allReqs = []

    for req in all_reqs:
        get_user = Users.query.filter_by(id=req.user_id).first()
        allReqs.append({
            "row_id": req.id,
            "user_id": get_user.id,
            "user_name": get_user.name
        })

    return jsonify(allReqs)


@admin.route("/reject-req-job", methods=["POST"])
def reject_req_job():
    row_id = request.json["row_id"]
    get_req = PermanentJobRequests.query.filter_by(id=row_id).first()
    if get_req:
        db.session.delete(get_req)
        db.session.commit()

    return "done"


@admin.route("/accept-req-job", methods=["POST"])
def accept_req_job():
    data = request.json
    user_id = data["user_id"]
    job_id = data["job_id"]
    row_id = data["row_id"]

    get_req = PermanentJobRequests.query.filter_by(id=row_id).first()

    job_data = PermanentJobs.query.filter_by(job_id=job_id).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))

    get_user = Users.query.filter_by(id=user_id).first()
    permanent_job_list = list(json.loads(get_user.permanent_jobs))

    users_arr.append({"id": user_id, "name": get_user.name})
    permanent_job_list.append({
        "job_id": job_id,
        "job_name": job_data.job_name,
        "job_location": job_data.job_location,
        "job_start_time": job_data.job_start_time,
        "job_duration": job_data.job_duration
    })
    job_data.job_enrolled_ids = json.dumps(users_arr)
    get_user.permanent_jobs = json.dumps(permanent_job_list)

    db.session.delete(get_req)
    db.session.commit()

    return jsonify(users_arr)


@admin.route("/all-reqs")
def deleteAll():
    all_reqs = db.session.query(PermanentJobRequests).all()
    allReqs = []

    for req in all_reqs:
        allReqs.append({
            "id": req.id,
            "user_id": req.user_id,
            "job_id": req.job_id
        })

    return jsonify(allReqs)


# Authorize whole admin blueprint
# @admin.before_request
@AuthorizationRequired('admin')
def before_request():
    pass


# Testing route
@admin.route("/test")
def GetAdmin():
    return "Success", 200
