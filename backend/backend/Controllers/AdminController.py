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
    # print(formData)
    working_day_count = 0
    allItemsFromForm = []
    must_have = [
        "job_title",
        "job_address",
        "job_description",
        "pay_per_hr",
        "job_need_count",
        "timeline_data",
        "pay_per_hr_sub_contractor",
    ]

    for itm in must_have:
        if itm not in formData:
            return jsonify({"status": "error", "msg": "Details missing"})
        else:
            if formData[itm] == "":
                empty_field = ' '.join(itm.split('_')).capitalize()
                return jsonify({"status": "error", "msg": f"{empty_field} cannot be empty"})


    job_id = str(uuid4())
    job_name = formData[must_have[0]]
    job_desc = formData[must_have[2]]
    
    # job_payment_for_day = int(formData[must_have[5]])/(working_day_count*2)
    job_location = formData[must_have[1]]
    job_start_time = formData[must_have[3]]
    job_enrolled_ids = json.dumps([])
    job_need_count = formData[must_have[4]]

    pey_per_mo = 0
    pey_per_tu = 0
    pey_per_we = 0
    pey_per_th = 0
    pey_per_fr = 0
    pey_per_sa = 0
    pey_per_su = 0

    pay_per_hr = float(formData[must_have[3]])
    pay_per_hr_sub_contractor = float(formData[must_have[6]])

    timeTable = formData[must_have[5]]
    timeTableArr = json.loads(timeTable)
    pay_per_week = 0.0
    for timelineindx in range(len(timeTableArr)):
        startT, endT = timeTableArr[timelineindx]["time"].split("-")
        

        t1 = datetime.strptime(startT, "%H:%M")
        t2 = datetime.strptime(endT, "%H:%M")
        durationT = f"{t2 - t1}"[:-3]
        timeTableArr[timelineindx]["duration"] = durationT
        duration_hr, duration_min = durationT.split(":")
        duration_hr, duration_min = int(duration_hr), int(duration_min)/60
        duration_num = duration_hr+duration_min
        pay_per_day_sub_c = duration_num*pay_per_hr_sub_contractor
        pay_per_day_me = duration_num*pay_per_hr
        works_per_line = 0
        for dy in timeTableArr[timelineindx]["days"]:
            if dy != "":
                works_per_line+=1
                if dy == "Mo":
                    # pey_per_mo = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_mo += pay_per_day_sub_c
                if dy == "Tu":
                    # pey_per_tu = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_tu += pay_per_day_sub_c
                if dy == "We":
                    # pey_per_we = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_we += pay_per_day_sub_c
                if dy == "Th":
                    # pey_per_th = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_th += pay_per_day_sub_c
                if dy == "Fr":
                    # pey_per_fr = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_fr += pay_per_day_sub_c
                if dy == "Sa":
                    # pey_per_sa = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_sa += pay_per_day_sub_c
                if dy == "Su":
                    # pey_per_su = f"{pay_per_day_sub_c}-{pay_per_day_me}"
                    pey_per_su += pay_per_day_sub_c

        pay_per_week += works_per_line*pay_per_day_sub_c
        
    job_payment_for_fortnight = pay_per_week*2

    pey_per_mo = f"{pey_per_mo}-{(pey_per_mo/pay_per_day_sub_c)*pay_per_day_me}"
    pey_per_tu = f"{pey_per_tu}-{(pey_per_tu/pay_per_day_sub_c)*pay_per_day_me}"
    pey_per_we = f"{pey_per_we}-{(pey_per_we/pay_per_day_sub_c)*pay_per_day_me}"
    pey_per_th = f"{pey_per_th}-{(pey_per_th/pay_per_day_sub_c)*pay_per_day_me}"
    pey_per_fr = f"{pey_per_fr}-{(pey_per_fr/pay_per_day_sub_c)*pay_per_day_me}"
    pey_per_sa = f"{pey_per_sa}-{(pey_per_sa/pay_per_day_sub_c)*pay_per_day_me}"
    pey_per_su = f"{pey_per_su}-{(pey_per_su/pay_per_day_sub_c)*pay_per_day_me}"

    print(pey_per_mo)
    print(pey_per_tu)
    print(pey_per_we)
    print(pey_per_th)
    print(pey_per_fr)
    print(pey_per_sa)
    print(pey_per_su)
    job_timetable = json.dumps(timeTableArr)

    new_job = PermanentJobs(
        job_id=job_id,
        job_name=job_name,
        job_desc=job_desc,
        job_payment_for_fortnight=job_payment_for_fortnight,
        job_location=job_location,
        job_start_time=job_start_time,
        job_timetable=job_timetable,
        job_enrolled_ids=job_enrolled_ids,
        job_need_count=job_need_count,
        pey_per_mo = pey_per_mo,
        pey_per_tu = pey_per_tu,
        pey_per_we = pey_per_we,
        pey_per_th = pey_per_th,
        pey_per_fr = pey_per_fr,
        pey_per_sa = pey_per_sa,
        pey_per_su = pey_per_su,
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
            "job_payment_for_fortnight": jb.job_payment_for_fortnight,
            "job_location": jb.job_location,
            "job_timetable": json.loads(jb.job_timetable),
            "job_enrolled_ids": json.loads(jb.job_enrolled_ids),
            "pey_per_mo":jb.pey_per_mo,
            "pey_per_tu":jb.pey_per_tu,
            "pey_per_we":jb.pey_per_we,
            "pey_per_th":jb.pey_per_th,
            "pey_per_fr":jb.pey_per_fr,
            "pey_per_sa":jb.pey_per_sa,
            "pey_per_su":jb.pey_per_su,
        })
    return jsonify(return_data)


@admin.route("/get-permanent-jobs/<jobID>")
def get_a_permanent_job(jobID):
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    return_data = {
        "job_id": job_data.job_id,
        "job_name": job_data.job_name,
        "job_desc": job_data.job_desc,
        "job_payment_for_fortnight": job_data.job_payment_for_fortnight,
        "job_location": job_data.job_location,
        "job_timetable": json.loads(job_data.job_timetable),
        "job_enrolled_ids": json.loads(job_data.job_enrolled_ids),
        "pey_per_mo":job_data.pey_per_mo,
        "pey_per_tu":job_data.pey_per_tu,
        "pey_per_we":job_data.pey_per_we,
        "pey_per_th":job_data.pey_per_th,
        "pey_per_fr":job_data.pey_per_fr,
        "pey_per_sa":job_data.pey_per_sa,
        "pey_per_su":job_data.pey_per_su,
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

    job_real_times = PermanentJobs.query.filter_by(job_id=job_id).first()

    def locationLink(locationtxt):
        converted = convert_coordinates(locationtxt)
        return f"https://www.google.com.au/maps/place/{converted}/@{locationtxt}/"

    for job in job_datas:
        year, month, date = job.date.split("-")
        if str(year) == str(filter_by_year) and str(month) == f"{filter_by_month:02d}":
            end_location = ""
            if job.job_ended_location != "":
                end_location = locationLink(job.job_ended_location)

            jobDatas.append({
                "id": job.id,
                "user_id": job.user_id,
                "user_name": job.user_name,
                "job_id": job.job_id,
                "job_name": job.job_name,
                "date": job.date,
                "job_payment_for_day": job.job_payment_for_day,
                "job_status": job.job_status,
                "job_started_location": locationLink(job.job_started_location),
                "job_ended_location": end_location,
                "start_time":job.started_time,
                "end_time":job.ended_time,
                "job_counts_per_day":job.job_counts_per_day
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
