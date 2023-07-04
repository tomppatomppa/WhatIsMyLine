from flask import Flask, render_template



def create_app():
    app = Flask(__name__, static_folder="build/static", template_folder="build")

    register_blueprints(app)
    return app



def register_blueprints(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/<path:path>')
    def catch_all(path):
        return render_template('index.html')
 