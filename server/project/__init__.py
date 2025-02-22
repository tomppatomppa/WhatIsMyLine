import os
from datetime import timedelta
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_wtf import CSRFProtect
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask.logging import default_handler
from project.formatter.default_formatter import RequestFormatter
from project.logger_helper import setup_logger
from project.request_handlers import request_handlers

db = SQLAlchemy()
migrate = Migrate()
csrf_protection = CSRFProtect()

def create_app():
    app = Flask(__name__, template_folder="build", static_folder="build/static")
    
    jwt = JWTManager(app)
    
    config_type = os.getenv('CONFIG_TYPE', default='config.DevelopmentConfig')
    app.config.from_object(config_type)

    app.config["JWT_COOKIE_SECURE"] = True
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["SESSION_COOKIE_DOMAIN"] = True
    app.config["JWT_SESSION_COOKIE"] = False 
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=7)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["SESSION_COOKIE_HTTPONLY"] = True  
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    
    CORS(app, supports_credentials=True)
    
    init_formatters()
    initialize_extensions(app)
    create_upload_folders(app)
    request_handlers(app)
    register_blueprints(app)
    app.logger = setup_logger()
    
    with app.app_context():
       from .scheduler import init_scheduled_tasks 
       init_scheduled_tasks(app)

    return app

def init_formatters():
    formatter = RequestFormatter(
        '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
        '%(levelname)s in %(module)s: %(message)s'
    )
    default_handler.setFormatter(formatter)
    
def initialize_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)

#TODO: move to aws S3 or similar
def create_upload_folders(app):
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

    @app.route('/api/ping')
    def test():
        return "pongs"

    @app.route('/<path:path>')
    def catch_all(path):   
        return render_template('index.html')
    
    from .auth import auth_blueprint
    from .users import users_blueprint
    from .scripts import scripts_blueprint
    from .google import google_blueprint
    from .upload import upload_blueprint
    from .admin import admin_blueprint
    
    app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
    app.register_blueprint(users_blueprint, url_prefix="/api")
    app.register_blueprint(scripts_blueprint, url_prefix='/api')
    app.register_blueprint(google_blueprint, url_prefix='/api')
    app.register_blueprint(upload_blueprint, url_prefix='/api')
    app.register_blueprint(admin_blueprint, url_prefix='/api')
