from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..Models import Users, PermanentJobs
from .. import db
from ..allFunctions import usersObjToDictArr, userObjToDict
from datetime import timedelta
import json
from datetime import datetime


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
        "payment_per_fortnight"
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
        job_enrolled_ids=job_enrolled_ids
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
    return users_arr


@admin.route("/get-contractors", methods=["POST"])
def get_all_contractors():
    jobID = request.json['jobID']
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))
    all_users = db.session.query(Users).all()
    allUsers = []
    for usr in all_users:
        to_append = {
            "id": usr.id,
            "name": usr.name
        }
        if to_append not in users_arr:
            allUsers.append(to_append)

    return allUsers


@admin.route("/get-all-sub-contractors")
def get_all_contractors_to_show():
    all_users = db.session.query(Users).all()
    allUsers = []
    for usr in all_users:
        to_append = {
            "id": usr.id,
            "name": usr.name
        }
        allUsers.append(to_append)

    return allUsers


@admin.route("/get-contractor/<userID>")
def get_single_contractor(userID):
    user_data = Users.query.filter_by(id=userID).first()
    return userObjToDict(user_data)


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

    return return_state


# this route for testing porposes
@admin.route("/deleteall")
def deleteAll():
    all_jobs = db.session.query(PermanentJobs).all()
    for jb in all_jobs:
        job_data = PermanentJobs.query.filter_by(job_id=jb.job_id).first()
        db.session.delete(job_data)
        db.session.commit()
    return jsonify("")
