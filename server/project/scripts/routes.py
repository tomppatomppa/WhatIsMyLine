from flask_jwt_extended import jwt_required
from . import scripts_blueprint
from flask import request, jsonify, make_response
from project.models import Script

@scripts_blueprint.route("/", methods=["GET"])
def get_all():
    scripts = Script.get_all()
    return scripts, 200

