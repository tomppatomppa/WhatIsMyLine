from . import scripts_blueprint
from flask import request,  make_response
from flask_jwt_extended import jwt_required
from project.models import Script
from project import db
import json

@scripts_blueprint.route("/script", methods=["GET"])
#TODO: Add jwt_required add disable while testing
def get_all():
    query = db.select(Script)
    scripts = db.session.execute(query).scalars().all()
    if not scripts:
        return "No scripts found", 404
    
    response = make_response(json.dumps([script.to_dict() for script in scripts]), 200)
    return response

@scripts_blueprint.route("/", methods=["POST"])
def create():
    data = request.get_json()
    new_script = Script(**data)
    
    db.session.add(new_script)
    db.session.commit()    
    return "new_script", 200

