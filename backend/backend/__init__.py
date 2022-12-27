from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from os import path
from flask_login import LoginManager
from flask_cors import CORS
import uuid
import os


db = SQLAlchemy()
DB_NAME = 'database.sqlite3'


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    app.config['SECRET_KEY'] = "7c0b1c38-938b-4cce-831d-f3a4dc89e582-4f1ee439-7ee1-4ed2-a44a-5c07f4467a7b"
    app.config["JWT_SECRET_KEY"] = "9f9373d8-a595-4036-bba5-61b45f5f467d-ce14bb63-0a95-4f8c-b5bb-348b61242c64"
    db.init_app(app)

    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)

    from .views import views
    from .auth import auth
    from .admin import admin

    app.register_blueprint(views, url_prefix="/api/views")
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(admin, url_prefix="/api/admin")

    return app


# database has been created now
def create_database(app, db):
    if not os.path.exists(f'instance/{DB_NAME}'):
        with app.app_context():
            db.create_all()
            print("DB Created")
