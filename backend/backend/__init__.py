from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
import uuid
import os


db = SQLAlchemy()
DB_NAME = 'database.sqlite3'


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "45cb40bd-b526-44a8-95db-b10f24ca471e"
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix="/api/views")
    app.register_blueprint(auth, url_prefix="/api/auth")

    return app


# database has been created now
def create_database(app, db):
    if not os.path.exists(f'instance/{DB_NAME}'):
        with app.app_context():
            db.create_all()
            print("DB Created")
