from . import google_blueprint
from flask import request, jsonify
import project.google.driveUtils as driveUtils
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import functools
import requests
import os
from tests.conftest import credentials_for_testing
from project.google.TextToSpeech import create_data
from utils import  remove_dir
from flask_jwt_extended import jwt_required




def add_drive_service(func):
    '''
    TODO: Use get_JWT_identity to refresh token
    When testing set .env variables
    In production assume token is refreshed on client side before making the request
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        access_token = extract_token(request)
        credentials = Credentials(
            token=access_token,
            refresh_token = os.environ["TEST_REFRESH_TOKEN"],
            client_id = os.environ["CLIENT_ID"],
            client_secret = os.environ["CLIENT_SECRET"],
            token_uri = "https://oauth2.googleapis.com/token"
            )
        service = build('drive', 'v3', credentials=credentials)
    
        return func(service, *args, **kwargs)
    return wrapper

@google_blueprint.route("/api/drive/create_root_folder",  methods=["POST"])
@jwt_required()
@add_drive_service
def check_root_folder(service):
    try:
        folder_name = request.json.get('folderName')
        files = driveUtils.search_folder_in_root(service, "root", folder_name)
        print(folder_name)    
        if len(files) == 1:
            
            return files[0], 200
        if not files:
           
            folder = driveUtils.create_folder_in_root(service, parent_id=None, folder_name=folder_name)
            return folder, 200

        return f"Multiple folders with the name '{folder_name}' already exists in this location.", 400
    
    except requests.exceptions.HTTPError as error:
        if error.response.status_code == 401:
           handle_unauthorized(error)
        return "Something went wrong", 404     
   

@google_blueprint.route("/api/drive/scene-to-speech", methods=["POST"])
@jwt_required()
@add_drive_service
def upload_scene(service):
    try:
        root_folder_id, script_id, scene_id = get_folder_ids(request)
        
        script_folder = driveUtils.find_or_create_folder(service, root_folder_id, script_id)
        scene_folder = driveUtils.find_or_create_folder(service, script_folder[0]["id"], scene_id)
        
        create_data(request.json)
        filepath = f"./processed_audio/{script_id}/{scene_id}"
        #Upload audio files to google drive
        result = []
        for filename in os.listdir(filepath):
            file = driveUtils.upload_audio_to_drive(service, scene_folder.get("id"), f"{filepath}/{filename}")
            result.append(file)
        
        return result, 200
    except requests.exceptions.HTTPError as error:
       if error.response.status_code == 401:
           handle_unauthorized(error)
       return jsonify({'error': 'An error occurred'}), error.response.status_code
    
    finally:
       remove_dir(f"./processed_audio/{script_id}")


@google_blueprint.route("/api/v3/scene-to-speech", methods=["POST"])
@jwt_required()
def scene_to_speech():

    access_token = extract_token(request)

    script_id = request.json.get("id")
    scene_id = request.json.get("scenes")[0].get("id")
    root_folder_id = request.json.get("rootFolderId")
    
    try:
        create_data(request.json)
        script_folder = driveUtils.create_folder(access_token, root_folder_id, script_id)
        scene_folder = driveUtils.create_folder(access_token, script_folder.get("id"), scene_id) 
        filepath = f"./processed_audio/{script_id}/{scene_id}"
        
        #Upload audio files to google drive
        for filename in os.listdir(filepath):
            driveUtils.upload_mp3_to_drive(access_token, scene_folder.get("id"), f"{filepath}/{filename}")
        return scene_folder, 200
    
    except requests.exceptions.HTTPError as error:
        if error.response.status_code == 401:
            handle_unauthorized(error)
        return jsonify({'error': 'An error occurred'}), error.response.status_code
    finally:
       
        remove_dir(f"./processed_audio/{script_id}")

@google_blueprint.route("/api/drive/<folder_id>", methods=["DELETE"])
@jwt_required()
@add_drive_service
def delete_folder(service, folder_id):
    try:
        driveUtils.delete_folder_by_id(service, folder_id)
        return f"Folder with the id {folder_id} delete succesfully", 200
    except requests.exceptions.HTTPError as error:
        if error.response.status_code == 401:
            handle_unauthorized(error)
        return jsonify({'error': 'An error occurred'}), error.response.status_code    
    
    

def extract_token(request):
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return token

@google_blueprint.errorhandler(401)
def handle_unauthorized(error):
    return jsonify({'error': str(error)}), 401


def get_folder_ids(request):
    script_id = request.json.get("id")
    scene_id = request.json.get("scenes")[0].get("id")
    root_folder_id = request.json.get("rootFolderId")
    return  root_folder_id, script_id, scene_id, 
