import os
import pymupdf4llm
from . import scripts_blueprint
from flask import request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from project.models import Script
import json


@scripts_blueprint.route("/scripts", methods=["GET"])
@jwt_required()
def get_all():
    try:
        scripts = Script.get_scripts_by_user_id(get_jwt_identity())
      
        response = make_response(json.dumps(scripts), 200)
        return response
    except Exception as error:
        return str(error), 404
   

@scripts_blueprint.route("/script/<script_id>", methods=["GET"])
@jwt_required()
def get_by_script_id(script_id):
   
    script = Script.get_script_by_script_id(script_id, get_jwt_identity())
    if not script:
        return "Script doesn't exist", 404

    response = make_response(json.dumps(script.to_dict()), 200)
    return response


@scripts_blueprint.route("/script", methods=["POST"])
@jwt_required()
def create():
    script = request.get_json()
    try:
        new_script = Script.add_script(script, get_jwt_identity())

        return json.dumps(new_script.to_dict()), 200
    except Exception as error:
        return str(error), 400
   

@scripts_blueprint.route("/script/<script_id>", methods=["DELETE"])
@jwt_required()
def delete(script_id):
    deleted_script = Script.delete_script_by_script_id(script_id, get_jwt_identity())

    if deleted_script:
        return f"Script {deleted_script.script_id} Deleted Succesfully", 200
    else:
        return "Error deleting script", 404

@scripts_blueprint.route("/script/<script_id>", methods=["PUT"])
@jwt_required()
def update(script_id):
    script_to_update = Script.get_script_by_script_id(script_id, get_jwt_identity())

    if not script_to_update:
        return "Error updating script", 404
 
    updated_data = request.get_json()
    updated_script = Script.update(updated_data, script_to_update)
   
    return json.dumps(updated_script.to_dict()), 200

@scripts_blueprint.route("/script/markdown-test", methods=["GET"])
def get_markdown():
    folder_path = os.path.abspath("uploaded_files")
   
    try:
        md_text = pymupdf4llm.to_markdown(f'{folder_path}/1.9.pdf')
   
        return md_text, 200

    except Exception as e:
        return "ERROR", 404
    
   
   

