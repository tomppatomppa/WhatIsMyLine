import base64
from . import google_blueprint
from flask import request, jsonify
import project.google.driveUtils as driveUtils
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import functools
import requests
import os
<<<<<<< HEAD
from project.google.TextToSpeech import  create_data
from utils import remove_dir
from flask_jwt_extended import jwt_required, get_jwt_identity
from project.models import User
=======
from project.google.TextToSpeech import create_data
from utils import  remove_dir
from flask_jwt_extended import jwt_required
>>>>>>> main


def add_drive_service(func):
    '''
    TODO: Use get_JWT_identity to refresh token
    When testing set .env variables
    In production assume token is refreshed on client side before making the request
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        access_token = extract_token(request)
        
        refresh_token = None
        if os.getenv('CONFIG_TYPE') == 'config.TestingConfig':
            refresh_token = os.getenv("TEST_REFRESH_TOKEN")
            
        credentials = Credentials(
            token=access_token,
            refresh_token = refresh_token,
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
        files = driveUtils.search_folder(service, "root", folder_name)
        
        if len(files) == 1:
            return files[0], 200
        if not files:
            folder = driveUtils.create_folder(service, parent_id=None, folder_name=folder_name)
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
        scene_folder = driveUtils.find_or_create_folder(service, script_folder["id"], scene_id)
        
        create_data(request.json)
        filepath = f"./processed_audio/{script_id}/{scene_id}"

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

@google_blueprint.route("/api/drive/download", methods=["POST"])
@jwt_required()
@add_drive_service
def download_scene_audio(service):
    try:
        root_folder_id, script_id, scene_id, lines = extract_request_data(request.json)
        
        script_folder = driveUtils.search_folder(service, root_folder_id, script_id)
        if not script_folder:
            return "Script Folder Missing", 404

        scene_folder = driveUtils.search_folder(service, script_folder[0]["id"], scene_id)
        if not scene_folder:
            return "Scene Folder Missing", 404
        
        audio_files = driveUtils.list_audio_files_in_folder(service, scene_folder[0]["id"])

        if not check_line_ids_exist(lines, audio_files):
            return "Not all Line IDs exist in Audio IDs", 400
      
        files = []
        for file in audio_files:
            file_id = file['id']
            file_name = file['name']

            file_content = driveUtils.download_file(service, file_id)
            if file_content is not None:
                
                base64_content = base64.b64encode(file_content).decode('utf-8')
                files.append({
                'content': base64_content,
                'id': file_id,
                'filename': file_name
                })
            
        return jsonify(files=files)
    
    except requests.exceptions.HTTPError as error:
       if error.response.status_code == 401:
           handle_unauthorized(error)
       return jsonify({'error': 'An error occurred'}), error.response.status_code
 
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
    
@google_blueprint.errorhandler(401)
def handle_unauthorized(error):
    return jsonify({'error': str(error)}), 401
    
    
'''
Helper functions
'''
def extract_token(request):
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return token

def get_folder_ids(request):
    script_id = request.json.get("id")
    scene_id = request.json.get("scenes")[0].get("id")
    root_folder_id = request.json.get("rootFolderId")
    return  root_folder_id, script_id, scene_id, 

def check_line_ids_exist(lines, audio_files):
    line_ids = [line['id'] for line in lines]
    audio_ids = [audio['name'].replace(".mp3", "") for audio in audio_files]
    return all(line_id in audio_ids for line_id in line_ids)

def extract_request_data(request_json):
    root_folder_id = request_json.get("rootId")
    script_id = request_json.get("scriptId")
    scene_id = request_json.get("sceneId")
    lines = request_json.get("lines")
    return root_folder_id, script_id, scene_id, lines