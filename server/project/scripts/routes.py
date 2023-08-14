from . import scripts_blueprint
from flask import request,  make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from project.models import Script
from project import db
import json


@scripts_blueprint.route("/script", methods=["GET"])
@jwt_required()
def get_all():
    query = db.select(Script).where(Script.user_id == get_jwt_identity())
    scripts = db.session.execute(query).scalars().all()
    if not scripts:
        return "No scripts found", 404
    
    response = make_response(json.dumps([script.to_dict() for script in scripts]), 200)
    return response

@scripts_blueprint.route("/script/<id>", methods=["GET"])
@jwt_required()
def get_script_by_id(id):
    query = db.select(Script).where(
        Script.user_id == get_jwt_identity(),
        Script.script_id == id)
    
    script = db.session.execute(query).scalars().one()
    if not script:
        return "Script doesn't exist", 404
    
    response = make_response(json.dumps(script.to_dict()), 200)
    return response


@scripts_blueprint.route("/script", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    data["user_id"] = get_jwt_identity()
    try:
        new_script = Script(**data)
        db.session.add(new_script)
        db.session.commit()    
        return json.dumps(new_script.to_dict()), 200
    except Exception as error:
        return str(error), 400
   

