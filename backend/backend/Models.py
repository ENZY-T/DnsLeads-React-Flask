from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy import DDL, event


class Users(db.Model, UserMixin):
    __tablename__ = 'Users'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(250))
    role = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(250))
    zip_code = db.Column(db.String(250))
    contact_no = db.Column(db.String(250), unique=True)
    email = db.Column(db.String(250), unique=True)
    abn = db.Column(db.String(250), unique=True)
    passport_number = db.Column(db.String(250), unique=True)
    bank_name = db.Column(db.String(250))
    account_type = db.Column(db.String(250))
    account_name = db.Column(db.String(250))
    account_number = db.Column(db.String(250), unique=True)
    bsb = db.Column(db.String(250))
    address_proof_img = db.Column(db.String(250))
    passport_img = db.Column(db.String(250))
    police_check_img = db.Column(db.String(250))
    children_check_img = db.Column(db.String(250))
    agreement_img = db.Column(db.String(250))
    verified = db.Column(db.String(10))
    password = db.Column(db.String(250))
    permanent_jobs = db.Column(db.String(2000))
    quick_jobs = db.Column(db.String(2000))

    current_permanent_job_row_id = db.Column(db.String(50))
    current_quick_job_row_id = db.Column(db.String(50))
    current_permanent_job_id = db.Column(db.String(50))
    current_quick_job_id = db.Column(db.String(50))


class PermanentJobs(db.Model):
    __tablename__ = 'PermanentJobs'

    job_id = db.Column(db.String(50), primary_key=True)
    job_name = db.Column(db.String(250))
    job_desc = db.Column(db.String(1500))
    job_payment_for_fortnight = db.Column(db.String(10))
    pey_per_mo = db.Column(db.String(10))
    pey_per_tu = db.Column(db.String(10))
    pey_per_we = db.Column(db.String(10))
    pey_per_th = db.Column(db.String(10))
    pey_per_fr = db.Column(db.String(10))
    pey_per_sa = db.Column(db.String(10))
    pey_per_su = db.Column(db.String(10))
    job_location = db.Column(db.String(500))
    job_start_time = db.Column(db.String(30))
    job_timetable = db.Column(db.String(500))
    job_enrolled_ids = db.Column(db.String(10000))
    job_need_count = db.Column(db.String(5))


class QuickJobs(db.Model):
    __tablename__ = 'QuickJobs'

    job_id = db.Column(db.String(50), primary_key=True)
    job_name = db.Column(db.String(250))
    job_desc = db.Column(db.String(1500))
    job_location = db.Column(db.String(500))
    job_start_time = db.Column(db.String(30))
    job_date = db.Column(db.String(30))
    pay_per_hr_for_c = db.Column(db.String(10))
    pay_per_hr_for_me = db.Column(db.String(10))
    job_enrolled_ids = db.Column(db.String(10000))
    job_need_count = db.Column(db.String(5))
    job_available = db.Column(db.String(10))


class CompletedJobs(db.Model):
    __tablename__ = 'CompletedJobs'

    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50))
    user_name = db.Column(db.String(150))
    job_id = db.Column(db.String(50))
    job_name = db.Column(db.String(150))
    started_time = db.Column(db.String(20))
    ended_time = db.Column(db.String(20))
    date = db.Column(db.String(20))
    job_payment_for_day = db.Column(db.String(20))
    job_status = db.Column(db.String(20))
    job_started_location = db.Column(db.String(50))
    job_ended_location = db.Column(db.String(50))
    job_counts_per_day = db.Column(db.String(10))


class CompletedQuickJobs(db.Model):
    __tablename__ = "CompletedQuickJobs"

    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50))
    user_name = db.Column(db.String(150))
    job_id = db.Column(db.String(50))
    job_name = db.Column(db.String(150))
    started_time = db.Column(db.String(20))
    ended_time = db.Column(db.String(20))
    date = db.Column(db.String(20))
    job_payment_for_day = db.Column(db.String(10))
    job_duration = db.Column(db.String(10))
    job_status = db.Column(db.String(10))
    job_started_location = db.Column(db.String(50))
    job_ended_location = db.Column(db.String(50))



class BlacklistedAccessTokens(db.Model):
    __tablename__ = "BlacklistedAccessTokens"

    access_token = db.Column(db.String(500), primary_key=True)
    time_added = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())


class JobRequests(db.Model):
    __tablename__ = "JobRequests"

    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50))
    job_id = db.Column(db.String(50))


class GalleryList(db.Model):
    __tablename__ = "GalleryList"

    id = db.Column(db.String(50), primary_key=True)
    img_path = db.Column(db.String(500))
    category = db.Column(db.String(100))