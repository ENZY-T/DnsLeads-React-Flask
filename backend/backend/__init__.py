from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
# from .middlewares.AuthorizationMiddleware import AuthorizationRequired

import os


db = SQLAlchemy()
# DB_NAME = 'database.sqlite3'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_USERNAME = "root"
DB_HOST = "localhost"
DB_PASSWORD = ""
DB_PORT = 3306
DB_NAME = "dns_lead"

app = Flask(__name__)
# app.wsgi_app = middleware(app.wsgi_app)


def create_app():

    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    app.config['SECRET_KEY'] = "7c0b1c38-938b-4cce-831d-f3a4dc89e582-4f1ee439-7ee1-4ed2-a44a-5c07f4467a7b"
    app.config["JWT_SECRET_KEY"] = "9f9373d8-a595-4036-bba5-61b45f5f467d-ce14bb63-0a95-4f8c-b5bb-348b61242c64"
    app.config['STATIC_URL_PATH'] = '/static'
    app.config['RBAC_USE_WHITE'] = True

    db.init_app(app)
    CORS(app)
    Bcrypt(app)
    JWTManager(app)

    from .Views import views
    from .Controllers.AuthController import auth
    from .Controllers.AdminController import admin
    from .Controllers.UserController import user

    app.register_blueprint(views, url_prefix="/api/views")
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(user, url_prefix="/api")
    app.register_blueprint(admin, url_prefix="/api/admin")

    # create_database(app, db)

    return app


# # database has been created now
# def create_database(app, db):
#     if not os.path.exists(f'instance/{DB_NAME}'):
#         with app.app_context():
#             try:
#                 db.create_all()
#                 print(" * DB Created")
#             except Exception as e:
#                 print(e)
#     else:
#         print(' * DB Found.')
