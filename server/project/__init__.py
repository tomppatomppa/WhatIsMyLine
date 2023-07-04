import pathlib
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import os
def create_app():
    app = Flask(__name__, static_folder="build/static", template_folder="build")

    CORS(app)
    create_upload_folder(app)
    register_blueprints(app)
    
    return app

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
    
    from .users import users_blueprint
    from .google import google_blueprint
    from .upload import upload_blueprint

    app.register_blueprint(users_blueprint)
    app.register_blueprint(google_blueprint)
    app.register_blueprint(upload_blueprint)