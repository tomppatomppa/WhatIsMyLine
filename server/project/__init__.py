from flask import Flask, redirect, render_template, url_for,make_response,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import sqlalchemy as sa
from flask import Flask
from flask_login import LoginManager, login_required
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect, csrf
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
import os

db = SQLAlchemy()

login = LoginManager()
login.login_view = "users.login"
csrf_protection = CSRFProtect()


def create_app():
    app = Flask(__name__, static_folder="build/static", template_folder="build")

    jwt = JWTManager(app)
    
    config_type = os.getenv('CONFIG_TYPE', default='config.DevelopmentConfig')
    app.config.from_object(config_type)
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    CORS(app, supports_credentials=True)
    
    initialize_extensions(app)
    create_upload_folder(app)
    register_blueprints(app)
    
    engine = sa.create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    inspector = sa.inspect(engine)
    if not inspector.has_table("users"):
        with app.app_context():
            db.drop_all()
            db.create_all()
            app.logger.info('Initialized the database!')
    else:
        app.logger.info('Database already contains the users table.')
    
    return app
   

def initialize_extensions(app):
   
    db.init_app(app)



def create_upload_folder(app):
    try:
        path = os.path.dirname('current path')
        upload_folder = os.path.join(path.replace("/file_folder",""), "uploaded_files")
        processed_audio = os.path.join(path.replace("/file_folder",""), "processed_audio")
        os.makedirs(upload_folder, exist_ok=True)
        os.makedirs(processed_audio, exist_ok=True)
        app.config['uploaded_files_folder'] = upload_folder
        app.config['processed_audio'] = processed_audio
    except Exception as e:
        app.logger.info('An error occurred while creating folder')
        app.logger.error('Exception occurred : {}'.format(e))


def register_blueprints(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/<path:path>')
    def catch_all(path):
        return render_template('index.html')
    
    @app.route("/csrf")
    def get_csrf():
        response = jsonify(detail="success")
        response.headers.set("X-CSRFToken", csrf.generate_csrf())
        return response
    
    from .users import users_blueprint
    from .google import google_blueprint
    from .upload import upload_blueprint
    
    app.register_blueprint(users_blueprint)
    app.register_blueprint(google_blueprint)
    app.register_blueprint(upload_blueprint)

    