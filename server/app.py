from flask import Flask, request, render_template, send_file, send_from_directory
from PyMuReaderV3 import ReaderV3
from flask_cors import CORS
from config import allowed_file, create_upload_folder,process_uploaded_file_v3
from TextToSpeech import text_to_mp3, create_data
from zipfile import ZipFile
import os
import io
import json
import requests

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)

create_upload_folder(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')


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


@app.route("/api/v3/text-to-speech", methods=["POST"])
def text_to_speech():
   
    data = request.json["script"]
    
    #create_data(data)
    return "text-to-speech endpoint", 200


@app.route("/api/v3/scene-to-speech", methods=["POST"])
def scene_to_speech():
    # folder_path = '/processed_audio/35a2f575-6fff-4f93-b3c2-5e17f0235b31.zip'
    

    # zip_buffer = io.BytesIO()

    # with ZipFile(zip_buffer, "w") as zipf:
    #     for root, dirs, files in os.walk(folder_path):
    #         for file in files:
    #             file_path = os.path.join(root, file)
    #             zipf.write(file_path, os.path.relpath(file_path, folder_path))

    # zip_buffer.seek(0)
  
    return send_from_directory(app.config["processed_audio"], "35a2f575-6fff-4f93-b3c2-5e17f0235b31.zip", as_attachment=True)


@app.route("/api/v3/create-folder", methods=["POST"])
def create_folder():
    headers = {"Authorization": "Bearer ya29.a0AWY7CknFWXVljSVi7We0NbBx7L6BQd7KbniXw5tGxKGguY-qkcf2mp3xMrgUeJCizabgd54RJW1QzhyJWWgVxMZgdruZEWpo0eBKaT3Bu-XvBkhT4-xgZQFzf-bo3sBdJx2FD3MHsdiz-ow9lwMU0a1LA4EoCuYaCgYKAQASARASFQG1tDrpHQ6FNiRapQ7TwP2C8_-BFg0166"}
    para = {
        "name": "testfile.txt",
        
    }
    files = {
        "data": ("metadata", json.dumps(para), "application/json; charset=UTF-8"),
        "file": open("./sample.txt", "rb")
    }
    result = requests.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=media",
                          headers=headers, files=files)
    print(result.text)
    return result.text, 200