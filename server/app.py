from flask import Flask,request, render_template, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path

from PyMuReaderV2 import ReaderV2
from PyMuReaderV3 import ReaderV3
from flask_cors import CORS
import shutil
import os
import json
from config import allowed_file, create_temp_folder

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')


@app.route("/api/v2/")
def read_v2():
    try:
        reader = ReaderV2()
        reader.read_file("./testfiles/testfile.pdf")
        return reader.to_html()   
    except FileNotFoundError as e:
        return json.dumps(e)

@app.route("/api/v2/upload", methods=['POST'])
def upload():
    create_temp_folder(app)
    
    if "file" not in request.files:
       return 'No file', 500

    file = request.files['file']
    if file.filename == '':
        return 'Invalid filename', 403

    if file and allowed_file(file.filename):
        return process_uploaded_file(file)

    return 'Invalid filetype', 403


def process_uploaded_file(file):
    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config.get('upload_folder'), filename)
    file.save(save_path)

    file_size = Path(save_path).stat().st_size
    #TODO: check for too large files
    reader = ReaderV2()
    reader.read_file(f'./tmp/{filename}')
    shutil.rmtree(app.config.get('upload_folder')) # remove tmp folder
    
    return reader.to_html()


@app.route("/api/v3/")
def read_v3():
    try:
        reader = ReaderV3()
        reader.read_file("./testfiles/testfile.pdf")
        result = reader.to_json()
        return json.dumps(result)   
    except FileNotFoundError as e:
        return json.dumps(e)


@app.route("/api/v3/upload", methods=['POST'])
def upload_v3():
    create_temp_folder(app)
    
    if "file" not in request.files:
       return 'No file', 500

    file = request.files['file']
    if file.filename == '':
        return 'Invalid filename', 403

    if file and allowed_file(file.filename):
        return process_uploaded_file_v3(file)

    return 'Invalid filetype', 403

def process_uploaded_file_v3(file):
    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config.get('upload_folder'), filename)
    file.save(save_path)

    file_size = Path(save_path).stat().st_size
    #TODO: check for too large files
    reader = ReaderV3()
    reader.read_file(f'./tmp/{filename}')
    shutil.rmtree(app.config.get('upload_folder')) # remove tmp folder
    
    return json.dumps(reader.to_json())  
