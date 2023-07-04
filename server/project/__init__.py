from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder="build/static", template_folder="build")

    CORS(app)
    register_blueprints(app)
    
    return app



def register_blueprints(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/<path:path>')
    def catch_all(path):
        return render_template('index.html')
    
    from .users import users_blueprint

    app.register_blueprint(users_blueprint)