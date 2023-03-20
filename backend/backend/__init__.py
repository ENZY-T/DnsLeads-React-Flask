from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask import request
import os
import time
import logging
import traceback
from logging.handlers import RotatingFileHandler
from time import strftime


# from .middlewares.AuthorizationMiddleware import AuthorizationRequired
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if not os.path.exists('logs'):
    os.mkdir('logs')

db = SQLAlchemy()

# DB_NAME = 'database.sqlite3'

DB_USERNAME = "dns_user"
DB_PASSWORD = "dns123"
DB_HOST = "mysql"
DB_NAME = "dns_db"

DB_PORT = 3306
# DB_HOST = os.environ['MYSQL_HOST'],
# DB_USERNAME = os.environ['MYSQL_USER'],
# DB_PASSWORD = os.environ['MYSQL_PASSWORD'],
# DB_NAME = os.environ['MYSQL_DB']

# logger.debug(DB_HOST)
# logger.debug(DB_USERNAME)
# logger.debug(DB_PASSWORD)
# logger.debug(DB_NAME)
# DB_NAME = 'database.sqlite3'

app = Flask(__name__, static_url_path='/static', static_folder='static')
# app.wsgi_app = middleware(app.wsgi_app)

# logging
handler = RotatingFileHandler('app.log', maxBytes=100000, backupCount=3)
logger = logging.getLogger('tdm')
logger.setLevel(logging.INFO)
logger.addHandler(handler)    

@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.info('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response

@app.errorhandler(Exception)
def exceptions(e):
    tb = traceback.format_exc()
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.error('%s %s %s %s %s 5xx INTERNAL SERVER ERROR\n%s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, tb)
    return {"msg":str(e)}, 500

def create_app():

    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    # app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    # app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    app.config['SECRET_KEY'] = "7c0b1c38-938b-4cce-831d-f3a4dc89e582-4f1ee439-7ee1-4ed2-a44a-5c07f4467a7b"
    app.config["JWT_SECRET_KEY"] = "9f9373d8-a595-4036-bba5-61b45f5f467d-ce14bb63-0a95-4f8c-b5bb-348b61242c64"
    app.config['STATIC_URL_PATH'] = '/static'
    app.config['RBAC_USE_WHITE'] = True

    # logger.info(app.config['SQLALCHEMY_DATABASE_URI'])

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

    create_database(app, db)

    return app


# database has been created now
def create_database(app, db):
    # if not os.path.exists(f'instance/{DB_NAME}'):
    # if not db.metadata.tables:
    with app.app_context():
        try:
            db.create_all()
            logger.info(" * DB Created")
        except Exception as e:
            logger.exception(e)
            logger.exception('Retrying....')
            time.sleep(3)
            create_database(app, db)
    # else:
    #     logger.debug(' * DB Found.')
