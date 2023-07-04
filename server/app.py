from flask import Flask, request, render_template
from flask_cors import CORS
from config import allowed_file, create_upload_folder,process_uploaded_file_v3
from TextToSpeech import  create_data
import jsonify
import os
import requests
from utils import create_timestamp, get_user, get_refresh_token, remove_dir
import GoogleDrive
from project import create_app

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")

app = create_app()
app.secret_key = SECRET_KEY

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

create_upload_folder(app)


@app.route("/api/v3/upload", methods=['POST'])
def upload_v3():
    if "file" not in request.files:
       return 'No file', 500

    file = request.files['file']
    if file.filename == '':
        return 'Invalid filename', 403
    
    if file and allowed_file(file.filename):
        result = process_uploaded_file_v3(file, app)
        return result

    return 'Invalid filetype', 403


@app.route("/api/v3/scene-to-speech", methods=["POST"])
def scene_to_speech():

    script_id = request.json.get("id")
    scene_id = request.json.get("scenes")[0].get("id")
    access_token = request.json.get("access_token")
    root_folder_id = request.json.get("rootFolderId")
    
    try:
        create_data(request.json)
        script_folder = GoogleDrive.create_folder(access_token, root_folder_id, script_id)
        scene_folder = GoogleDrive.create_folder(access_token, script_folder.get("id"), scene_id) 
        filepath = f"./processed_audio/{script_id}/{scene_id}"
        
        #Upload audio files to google drive
        for filename in os.listdir(filepath):
            GoogleDrive.upload_mp3_to_drive(access_token, scene_folder.get("id"), f"{filepath}/{filename}")
        return scene_folder, 200
    
    except requests.exceptions.HTTPError as error:
        if error.response.status_code == 401:
            handle_unauthorized(error)
        return jsonify({'error': 'An error occurred'}), error.response.status_code
    finally:
        remove_dir(f"./processed_audio/{script_id}")




@app.route("/create_root_folder",  methods=["POST"])
def create_root_folder():
    try:
        folderExists = GoogleDrive.search_folder(request)
        if folderExists:
            return folderExists, 200
        created_root_folder = GoogleDrive.create_root_folder(request)
        return created_root_folder, 200
    except requests.exceptions.HTTPError as error:
       if error.response.status_code == 401:
           handle_unauthorized(error)
       return jsonify({'error': 'An error occurred'}), error.response.status_code
   

@app.errorhandler(401)
def handle_unauthorized(error):
    return jsonify({'error': str(error)}), 401



if __name__ == '__main__':
  app.run(debug=True)