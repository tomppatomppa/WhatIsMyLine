from . import google_blueprint
from flask import request, jsonify
import project.google.driveUtils as driveUtils
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import functools
import requests
import os
from tests.conftest import credentials_for_testing
from project.google.TextToSpeech import  create_data
from utils import  remove_dir
from flask_jwt_extended import jwt_required

def add_drive_service(func):
    '''
    When testing set .env variables
    In production assume token is refreshed on client side
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        access_token = extract_token(request)
        credentials = Credentials(
            token=access_token,
            **credentials_for_testing()
            )
        service = build('drive', 'v3', credentials=credentials)
    
        return func(service, *args, **kwargs)
    return wrapper

@google_blueprint.route("/api/drive/create_root_folder",  methods=["POST"])
@jwt_required()
@add_drive_service
def check_root_folder(service):
    try:
        folder_name = request.json.get('folder_name')
        files = driveUtils.search_folder_in_root(service, folder_name)
        if len(files) == 1:
            return files[0], 200
        if not files:
            folder = driveUtils.create_folder_in_root(service, folder_name)
            return folder, 200

        return f"Multiple folders with the name '{folder_name}' already exists in this location.", 400
    
    except requests.exceptions.HTTPError as error:
        if error.response.status_code == 401:
           handle_unauthorized(error)
        return "Something went wrong", 404     
   


@google_blueprint.route("/create_root_folder",  methods=["POST"])
@jwt_required()
def create_root_folder():
    access_token = extract_token(request)
   
    try:
        folderExists = driveUtils.search_folder(access_token)
        if folderExists:
            return folderExists, 200
        created_root_folder = driveUtils.create_root_folder(access_token)
        return created_root_folder, 200
    except requests.exceptions.HTTPError as error:
       if error.response.status_code == 401:
           handle_unauthorized(error)
       return jsonify({'error': 'An error occurred'}), error.response.status_code
   

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

def extract_token(request):
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return token

@google_blueprint.errorhandler(401)
def handle_unauthorized(error):
    return jsonify({'error': str(error)}), 401


