from flask import Flask, request, render_template
from flask_cors import CORS
from config import allowed_file, create_upload_folder,process_uploaded_file_v3
from TextToSpeech import  create_data
import jsonify
import os
import requests
from utils import create_timestamp, get_user, get_refresh_token, remove_dir
import GoogleDrive

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")

app = Flask(__name__, static_folder="build/static", template_folder="build")
app.secret_key = SECRET_KEY

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

CORS(app)

create_upload_folder(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')


@app.route("/login", methods=["POST"])
def login():
    code = request.json.get('code')
    
    response = requests.post('https://oauth2.googleapis.com/token', data={
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': "postmessage",
        'grant_type': 'authorization_code',
        'scope': ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive.file"]
    })

    token_data = response.json()
    if response.status_code == 200 and token_data:
        expires_in = token_data.get("expires_in")
        #dummy db for saving user
        user = get_user(token_data.get("id_token"), token_data.get("refresh_token"))
        user["access_token"] = token_data.get("access_token")
        user["expiry"] = create_timestamp(expires_in)

        return user
    else:
        return 'Failed to login', 401

@app.route("/refresh_token",  methods=["POST"])
def refresh_token():
    user_id = request.json.get("user_id")
    payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': get_refresh_token(user_id),
        'grant_type': 'refresh_token'
    }
    try:
        response = requests.post('https://oauth2.googleapis.com/token', data=payload)
        response.raise_for_status()
        token_data = response.json()
        new_access_token = token_data.get('access_token')

        return new_access_token, 200
    except requests.exceptions.RequestException as e:
        error_message = str(e)
        return {'error': error_message}, 400


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
        print("DONE")
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