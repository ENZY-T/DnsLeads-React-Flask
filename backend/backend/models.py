from . import db
from flask_login import UserMixin


class Users(db.Model, UserMixin):
    __tablename__ = 'Users'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(250))
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


class PermanentJobs(db.Model):
    __tablename__ = 'PermanentJobs'
    
    job_id = db.Column(db.String(50), primary_key=True)
    job_name = db.Column(db.String(250))
    job_desc = db.Column(db.String(1500))
    job_duration = db.Column(db.String(250))
    job_payment_for_fortnight = db.Column(db.String(10))
    job_payment_for_day = db.Column(db.String(10))
    job_location = db.Column(db.String(500))
    job_start_time = db.Column(db.String(30))
    job_timetable = db.Column(db.String(500))
    job_enrolled_ids = db.Column(db.String(10000))


class QuickJobs(db.Model):
    __tablename__='QuickJobs'
    
    job_id = db.Column(db.String(50), primary_key=True)
    job_name = db.Column(db.String(250))
    job_desc = db.Column(db.String(1500))
    job_location = db.Column(db.String(500))
    job_start_time = db.Column(db.String(30))
    job_date = db.Column(db.String(500))
    job_payment_for_hour = db.Column(db.String(10))
    job_available_ids = db.Column(db.String(10000))


class CompletedJobs(db.Model):
    __tablename__= 'CompletedJobs'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50))
    job_id = db.Column(db.String(50))
    started_time = db.Column(db.String(20))
    ended_time = db.Column(db.String(20))
    date = db.Column(db.String(20))
    job_payment_for_day = db.Column(db.String(10))
