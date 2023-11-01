from datetime import timezone, timedelta, datetime
from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import sqlalchemy as sa
from flask_wtf import CSRFProtect
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, get_jwt_identity, set_access_cookies, jwt_required
import os


db = SQLAlchemy()
migrate = Migrate()
csrf_protection = CSRFProtect()

def create_app():
    app = Flask(__name__, template_folder="build", static_folder="build/static")
    
    jwt = JWTManager(app)
    
    config_type = os.getenv('CONFIG_TYPE', default='config.DevelopmentConfig')
    app.config.from_object(config_type)

    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    
    CORS(app, supports_credentials=True)
   
    initialize_extensions(app)
    create_upload_folders(app)
    register_request_handlers(app)
    register_blueprints(app)
    
    return app

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

def register_request_handlers(app):
    '''
    Refresh original if JWT is about to expire within the next 30 minutes.
    '''
    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(hours=12))
         
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            return response

def register_blueprints(app):
    @app.route('/')
    def index(): 
        return render_template('index.html')
    
    @app.route('/<path:path>')
    def catch_all(path):   
        return render_template('index.html')
    
    from .users import users_blueprint
    from .scripts import scripts_blueprint
    from .google import google_blueprint
    from .upload import upload_blueprint
   
    app.register_blueprint(users_blueprint, url_prefix="/api")
    app.register_blueprint(scripts_blueprint, url_prefix='/api')
    app.register_blueprint(google_blueprint, url_prefix='/api')
    app.register_blueprint(upload_blueprint, url_prefix='/api')

    