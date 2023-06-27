from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from uuid import uuid4
from ..Models import Users, PermanentJobs, CompletedJobs, JobRequests, QuickJobs, GalleryList, Invoice
from .. import db
from ..allFunctions import usersObjToDictArr, userObjToDict, convert_coordinates, imgPath
from datetime import timedelta
import json
from datetime import datetime, date
from sqlalchemy.sql.operators import and_
from ..middlewares.AuthorizationMiddleware import AuthorizationRequired
from .. import BASE_DIR
import calendar
from sqlalchemy import func


admin = Blueprint("admin", __name__)


def get_month_dates(year, month):
    num_dates = calendar.monthrange(year, month)[1]
    return num_dates


def getTimeAndDate():
    today = str(datetime.now())
    started_date = today.split(" ")[0]
    started_time = today.split(" ")[1].split(".")[0]

    return started_date, started_time


def get_day_txt():
    daysArr = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    today, _ = getTimeAndDate()
    year, month, day = today.split("-")
    year, month, day = int(year), int(month), int(day)
    dayIndex = date(year, month, day)
    return daysArr[dayIndex.weekday()]


MONTH_DATA = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]


def locationLink(locationtxt):
    converted = convert_coordinates(locationtxt)
    return f"https://www.google.com.au/maps/place/{converted}/@{locationtxt}/"


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
        "job_location"
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
    job_address = formData[must_have[7]]
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
                works_per_line += 1
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

    # print(pey_per_mo)
    # print(pey_per_tu)
    # print(pey_per_we)
    # print(pey_per_th)
    # print(pey_per_fr)
    # print(pey_per_sa)
    # print(pey_per_su)
    job_timetable = json.dumps(timeTableArr)

    new_job = PermanentJobs(
        job_id=job_id,
        job_name=job_name,
        job_desc=job_desc,
        job_payment_for_fortnight=job_payment_for_fortnight,
        job_location=job_location,
        job_address=job_address,
        job_start_time=job_start_time,
        job_timetable=job_timetable,
        job_enrolled_ids=job_enrolled_ids,
        job_need_count=job_need_count,
        pey_per_mo=pey_per_mo,
        pey_per_tu=pey_per_tu,
        pey_per_we=pey_per_we,
        pey_per_th=pey_per_th,
        pey_per_fr=pey_per_fr,
        pey_per_sa=pey_per_sa,
        pey_per_su=pey_per_su,
    )

    try:
        db.session.add(new_job)
        db.session.commit()
        # print(f"[DONE] Job Created Successfully\n[ID] {job_id}")
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
            "pey_per_mo": jb.pey_per_mo,
            "pey_per_tu": jb.pey_per_tu,
            "pey_per_we": jb.pey_per_we,
            "pey_per_th": jb.pey_per_th,
            "pey_per_fr": jb.pey_per_fr,
            "pey_per_sa": jb.pey_per_sa,
            "pey_per_su": jb.pey_per_su,
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
        "pey_per_mo": job_data.pey_per_mo,
        "pey_per_tu": job_data.pey_per_tu,
        "pey_per_we": job_data.pey_per_we,
        "pey_per_th": job_data.pey_per_th,
        "pey_per_fr": job_data.pey_per_fr,
        "pey_per_sa": job_data.pey_per_sa,
        "pey_per_su": job_data.pey_per_su,
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

    get_user = Users.query.filter_by(id=user_id).first()
    job_data = PermanentJobs.query.filter_by(job_id=job_id).first()
    job_type = ""
    if job_data:
        permanent_job_list = list(json.loads(get_user.permanent_jobs))
        job_type = "permanent"
    else:
        job_data = QuickJobs.query.filter_by(job_id=job_id).first()
        permanent_job_list = list(json.loads(get_user.quick_jobs))
        job_type = "quick"

    users_arr = list(json.loads(job_data.job_enrolled_ids))

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

    if job_type == "permanent":
        get_user.permanent_jobs = json.dumps(permanent_job_list)
    else:
        get_user.quick_jobs = json.dumps(permanent_job_list)

    db.session.commit()
    return jsonify(users_arr)


@admin.route("/get-contractors", methods=["POST"])
def get_all_contractors():
    jobID = request.json['jobID']
    job_data = PermanentJobs.query.filter_by(job_id=jobID).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))
    all_users = Users.query.all()
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


@admin.route("/get-all-users-list")
def get_all_users_list_to_show():
    all_users = Users.query.all()
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

    job_datas = CompletedJobs.query.filter_by(job_id=job_id).all()
    jobDatas = []

    job_real_times = PermanentJobs.query.filter_by(job_id=job_id).first()

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
                "start_time": job.started_time,
                "end_time": job.ended_time,
                "job_counts_per_day": job.job_counts_per_day
            })

    return jsonify(jobDatas)


@admin.route("/get-req-count", methods=["POST"])
def get_req_count():
    job_id = request.json["job_id"]
    return str(len(JobRequests.query.filter_by(job_id=job_id).all()))


@admin.route("/get-all-req-users", methods=["POST"])
def get_all_req_users():
    job_id = request.json["job_id"]
    all_reqs = JobRequests.query.filter_by(job_id=job_id).all()
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
    get_req = JobRequests.query.filter_by(id=row_id).first()
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

    get_req = JobRequests.query.filter_by(id=row_id).first()

    job_data = PermanentJobs.query.filter_by(job_id=job_id).first()
    get_user = Users.query.filter_by(id=user_id).first()

    if job_data:
        job_list = list(json.loads(get_user.permanent_jobs))
    else:
        job_data = QuickJobs.query.filter_by(job_id=job_id).first()
        job_list = list(json.loads(get_user.quick_jobs))

    users_arr = list(json.loads(job_data.job_enrolled_ids))

    users_arr.append({"id": user_id, "name": get_user.name})
    job_list.append({
        "job_id": job_id,
        "job_name": job_data.job_name,
        "job_location": job_data.job_location,
    })
    job_data.job_enrolled_ids = json.dumps(users_arr)
    get_user.permanent_jobs = json.dumps(job_list)

    db.session.delete(get_req)
    db.session.commit()

    return jsonify(users_arr)


@admin.route("/all-reqs")
def deleteAll():
    all_reqs = db.session.query(JobRequests).all()
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


@admin.route("/create-quick-job", methods=["POST"])
def create_quick_job():
    data = request.form
    must_have = [
        "job_title",
        "job_desc",
        "job_address",
        "c_count_for_job",
        "pay_per_hr_for_me",
        "pay_per_hr_for_c",
        "job_date",
        "job_time"
    ]

    for field in must_have:
        if field not in data:
            txt = (" ".join(field.split("_"))).capitalize()
            return jsonify({"status": "error", "msg": f"{txt} field cannot be missing"})
        if data[field] == "":
            return jsonify({"status": "error", "msg": f"{txt} field cannot be empty"})

    job_id = str(uuid4())

    new_job = QuickJobs(
        job_id=job_id,
        job_name=str(data[must_have[0]]),
        job_desc=str(data[must_have[1]]),
        job_location=str(data[must_have[2]]),
        job_start_time=str(data[must_have[7]]),
        job_date=str(data[must_have[6]]),
        pay_per_hr_for_c=str(data[must_have[5]]),
        pay_per_hr_for_me=str(data[must_have[4]]),
        job_enrolled_ids=str(json.dumps([])),
        job_need_count=str(data[must_have[3]]),
        job_available="true"
    )
    db.session.add(new_job)
    db.session.commit()
    # print(f"[JOB-CREATED] {job_id}")
    return ({"status": "done", "msg": f"done"})


@admin.route("/get-quick-jobs")
def get_quick_jobs():
    all_jobs = QuickJobs.query.all()
    allJobs = []

    for job in all_jobs:
        allJobs.append({
            "job_id": job.job_id,
            "job_name": job.job_name,
            "job_desc": job.job_desc,
            "job_location": job.job_location,
            "job_start_time": job.job_start_time,
            "job_date": job.job_date,
            "pay_per_hr_for_c": job.pay_per_hr_for_c,
            "pay_per_hr_for_me": job.pay_per_hr_for_me,
            "job_enrolled_ids": job.job_enrolled_ids,
            "job_need_count": job.job_need_count,
            "job_available": job.job_available,
        })

    return jsonify(allJobs)


@admin.route("/quick-job-data/<jobID>")
def get_quick_job_data(jobID):
    get_job_id = QuickJobs.query.filter_by(job_id=jobID).first()
    job_data = {
        "job_id": get_job_id.job_id,
        "job_name": get_job_id.job_name,
        "job_desc": get_job_id.job_desc,
        "job_location": get_job_id.job_location,
        "job_start_time": get_job_id.job_start_time,
        "job_date": get_job_id.job_date,
        "pay_per_hr_for_c": get_job_id.pay_per_hr_for_c,
        "pay_per_hr_for_me": get_job_id.pay_per_hr_for_me,
        "job_enrolled_ids": json.loads(get_job_id.job_enrolled_ids),
        "job_need_count": get_job_id.job_need_count,
        "job_available": get_job_id.job_available,
    }
    return jsonify(job_data)


@admin.route("/get-contractors-quick-jobs", methods=["POST"])
def get_all_contractors_quick_jobs():
    jobID = request.json['jobID']
    job_data = QuickJobs.query.filter_by(job_id=jobID).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))
    all_users = Users.query.all()
    allUsers = []
    for usr in all_users:
        to_append = {
            "id": usr.id,
            "name": usr.name
        }
        if to_append not in users_arr:
            allUsers.append(to_append)

    return jsonify(allUsers)


@admin.route("/add-or-remove-user-to-quick-job", methods=["POST"])
def add_user_to_quick_job():
    data = request.json
    if "id" not in data or "added_id" not in data or "added_name" not in data or "method" not in data:
        return jsonify({"status": "error", "msg": "Details missing"})

    method = data["method"]
    job_id = data["id"]
    user_id = data["added_id"]
    added_user_name = data["added_name"]

    job_data = QuickJobs.query.filter_by(job_id=job_id).first()
    users_arr = list(json.loads(job_data.job_enrolled_ids))

    get_user = Users.query.filter_by(id=user_id).first()
    quick_job_list = list(json.loads(get_user.quick_jobs))

    if method == "add":
        users_arr.append({"id": user_id, "name": added_user_name})
        quick_job_list.append({
            "job_id": job_id,
            "job_name": job_data.job_name,
            "job_location": job_data.job_location,
        })

    elif method == "remove":
        for usr in users_arr:
            if usr["id"] == user_id:
                users_arr.pop(users_arr.index(usr))
                break

        for jb in quick_job_list:
            if jb["job_id"] == job_id:
                quick_job_list.pop(quick_job_list.index(jb))
                break

    job_data.job_enrolled_ids = json.dumps(users_arr)
    get_user.quick_jobs = json.dumps(quick_job_list)

    db.session.commit()
    return jsonify(users_arr)


@admin.route("get-done-quick-jobs-by-place", methods=["POST"])
def get_done_quick_jobs_by_place():
    data = request.json
    jobs_data = CompletedJobs.query.filter_by(job_id=data["job_id"]).all()
    jobsData = []
    for job in jobs_data:
        jobsData.append({
            "id": job.id,
            "user_id": job.user_id,
            "user_name": job.user_name,
            "job_id": job.job_id,
            "job_name": job.job_name,
            "date": job.date,
            "job_payment_for_day": job.job_payment_for_day,
            "job_status": job.job_status,
            "job_started_location": locationLink(job.job_started_location),
            "job_ended_location": locationLink(job.job_ended_location),
            "start_time": job.started_time,
            "end_time": job.ended_time,
            "job_counts_per_day": job.job_counts_per_day
        })

    return jsonify(jobsData)


@admin.route("/upload-image-for-gallery", methods=["POST"])
def upload_image_for_gallery():
    before_imgs = request.files.getlist("before_imgs")
    after_imgs = request.files.getlist("after_imgs")

    path_static = os.path.join(BASE_DIR, "static")
    path_static_img = os.path.join(path_static, "img")
    path_static_img_gallery = os.path.join(path_static_img, "gallery")

    ROW_ID = str(uuid4())

    if not os.path.exists(path_static):
        os.mkdir(path_static)

    if not os.path.exists(path_static_img):
        os.mkdir(path_static_img)

    if not os.path.exists(path_static_img_gallery):
        os.mkdir(path_static_img_gallery)

    before_img_paths = []
    before_img_data = []

    after_img_paths = []
    after_img_data = []

    for b_file in before_imgs:
        IMG_ID = str(uuid4())
        save_file_path = os.path.join(
            path_static_img_gallery, f"{IMG_ID}.{str(b_file.filename).split('.')[-1]}")
        before_img_paths.append({"id": IMG_ID, "path": save_file_path})
        before_img_data.append(
            {"id": IMG_ID, "img": b_file, "save_path": save_file_path})

    for a_file in after_imgs:
        IMG_ID = str(uuid4())
        save_file_path = os.path.join(
            path_static_img_gallery, f"{IMG_ID}.{str(a_file.filename).split('.')[-1]}")
        after_img_paths.append({"id": IMG_ID, "path": save_file_path})
        after_img_data.append(
            {"id": IMG_ID, "img": a_file, "save_path": save_file_path})

    images_data = {
        "before": before_img_paths,
        "after": after_img_paths
    }
    catergory = str(request.form["catergory"])
    save_img = GalleryList(
        id=ROW_ID,
        img_paths=json.dumps(images_data),
        category=catergory
    )

    try:
        db.session.add(save_img)
        db.session.commit()

        ret_before_imgs = []
        ret_after_imgs = []

        for b_imgData in before_img_data:
            b_imgData["img"].save(b_imgData["save_path"])
            ret_before_imgs.append(
                {"id": b_imgData["id"], "img_path": imgPath(b_imgData["save_path"])})

        for a_imgData in after_img_data:
            a_imgData["img"].save(a_imgData["save_path"])
            ret_after_imgs.append(
                {"id": a_imgData["id"], "img_path": imgPath(a_imgData["save_path"])})

        ret_data = {
            "before": ret_before_imgs,
            "after": ret_after_imgs
        }

        return jsonify({"id": ROW_ID, "imgs": ret_data, "catergory": catergory})
    except Exception as e:
        return jsonify({"status": "error", "msg": "Something went wrong please try again letter. If you getting this msg many times please contact system admin."})


@admin.route("/get-gallery-imgs")
def get_gallery_imgs():
    all_imgs = GalleryList.query.all()
    allImgs = []

    for img in all_imgs:
        allImgsData = json.loads(img.img_paths)
        beforeImgsData = []
        afterImgsData = []

        for b_img_obj in allImgsData["before"]:
            beforeImgsData.append({
                "id": b_img_obj["id"],
                "img_path": imgPath(b_img_obj["path"])
            })

        for a_img_obj in allImgsData["after"]:
            afterImgsData.append({
                "id": a_img_obj["id"],
                "img_path": imgPath(a_img_obj["path"])
            })

        allImgs.append({
            "id": img.id,
            "imgs": {
                "before": beforeImgsData,
                "after": afterImgsData
            },
            "catergory": img.category
        })

    return jsonify(allImgs)


@admin.route("/remove-gallery-collection", methods=["POST"])
def remove_gallery_img():
    img_data = GalleryList.query.filter_by(
        id=request.json["collection_id"]).first()

    img_data_dict = json.loads(img_data.img_paths)

    if img_data:
        before_imgs = img_data_dict["before"]
        after_imgs = img_data_dict["after"]

        for imgObj in before_imgs:
            if os.path.exists(imgObj["path"]):
                os.remove(imgObj["path"])

        for imgObj in after_imgs:
            if os.path.exists(imgObj["path"]):
                os.remove(imgObj["path"])

        db.session.delete(img_data)
        db.session.commit()

        return ""
    else:
        return "", 400


@admin.route("/req-invoice-data", methods=["POST"])
def req_invoice_data():
    data = request.json
    job_id = data["job_id"]
    filter_by_year = data['year']
    filter_by_month = int(data['month'])

    invoice = Invoice.query.filter_by(job_id=job_id).filter_by(
        invoice_for_year=filter_by_year).filter_by(invoice_for_month=filter_by_month).first()

    if invoice:
        lastDay = get_month_dates(int(filter_by_year), int(filter_by_month))
        ret_data = {
            "invoice_number": invoice.invoice_number,
            "to_name": invoice.job_name,
            "to_address": invoice.receiver_address,
            "sub_total": invoice.sub_total,
            "gst": invoice.gst,
            "total": invoice.total,
            "duration": f"01 to {lastDay} {MONTH_DATA[int(filter_by_month)]}",
        }

        return jsonify(ret_data)
    else:
        job_datas = CompletedJobs.query.filter_by(job_id=job_id).all()
        job_real_times = PermanentJobs.query.filter_by(job_id=job_id).first()
        total_for_month = 0

        for job in job_datas:
            year, month, date = job.date.split("-")
            if str(year) == str(filter_by_year) and str(month) == f"{filter_by_month:02d}":
                end_location = ""
                if job.job_ended_location != "":
                    end_location = locationLink(job.job_ended_location)

                total_for_month_data = job.job_payment_for_day.split("-")
                total_for_month += float(total_for_month_data[1])

        # print("Total : ", total_for_month)
        sub_total = float(total_for_month)
        gst = float(sub_total*0.1)
        total = float(sub_total+gst)

        lastDay = get_month_dates(int(filter_by_year), int(filter_by_month))
        INVOICE_ID = str(uuid4())
        today, today_time = getTimeAndDate()

        # new_invoice_number = int(db.session.query(func.max(Invoice.invoice_number)).scalar())+1
        new_invoice_number_query = db.session.query(func.max(Invoice.invoice_number)).scalar()
        new_invoice_number = 1 if new_invoice_number_query is None else int(new_invoice_number_query) + 1

        month_end_date = f"{filter_by_year}-{filter_by_month}-{lastDay}"

        day01 = datetime.strptime(month_end_date, "%Y-%m-%d")
        day02 = datetime.strptime(today, "%Y-%m-%d")

        if day02 > day01:
            new_invoice = Invoice(
                id=INVOICE_ID,
                invoice_number=new_invoice_number,
                job_id=job_real_times.job_id,
                job_name=job_real_times.job_name,
                receiver_address=job_real_times.job_address,
                issue_date=today,

                invoice_from_date=f"{filter_by_year}-{filter_by_month}-01",
                invoice_to_date=month_end_date,

                invoice_for_month=filter_by_month,
                invoice_for_year=filter_by_year,

                sub_total=f"{sub_total:.2f}",
                gst=f"{gst:.2f}",
                total=f"{total:.2f}",
            )

            db.session.add(new_invoice)
            db.session.commit()

            ret_data = {
                "invoice_number": new_invoice_number,
                "to_name": job_real_times.job_name,
                "to_address": job_real_times.job_address,
                "sub_total": f"{sub_total:.2f}",
                "gst": f"{gst:.2f}",
                "total": f"{total:.2f}",
                "duration": f"01 to {lastDay} {MONTH_DATA[int(filter_by_month)]}",
            }

            return jsonify(ret_data)

        else:
            return jsonify({"msg": "Invoice requested month is not complete"}), 400



@admin.route("/manual-record-add", methods=["POST"])
def manual_add_record():
    print(" * Came here")
    print(request.data)
    print(request.json)
    print(request.form)
    m_payForMe = request.json['m_pay_for_me']
    m_payForCleaner = request.json['m_pay_for_cleaner']
    m_dateTime = str(request.json['m_date_time'])
    job_started_date, job_started_time = m_dateTime.split("T")

    user_id = request.json['m_done_by']
    job_id = request.json['job_id']

    user_data = Users.query.filter_by(id=user_id).first()
    job_data = PermanentJobs.query.filter_by(job_id=job_id).first()

    original_time = datetime.strptime(job_started_time, '%H:%M')
    new_time = original_time + timedelta(hours=2)
    job_ended_time = new_time.strftime('%H:%M')

    started_job = CompletedJobs(
        id=job_id,
        user_id=user_id,
        user_name=user_data.name,
        job_id=job_id,
        job_name=job_data.job_name,
        started_time=job_started_time,
        ended_time=job_ended_time,
        date=job_started_date,
        job_payment_for_day=f"{m_payForCleaner}-{m_payForMe}",
        job_status="done",
        job_started_location="-34.9501214,138.6287817",
        job_ended_location="-34.9501214,138.6287817",
        job_counts_per_day="0"
    )

    db.session.add(started_job)
    db.session.commit()

    return jsonify({"msg":"Record added succesfuly"}), 200