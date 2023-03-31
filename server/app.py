from flask import Flask,request, render_template, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path
from pyMuReader import Reader
from PyMuReaderV2 import ReaderV2
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

@app.route("/api/testfile")
def read_testfile():
    reader = Reader()
    result = []
    try:
        reader.read_file("./testfiles/default.pdf")
        json_object = reader.to_json()
        result.append(json.loads(json_object))
        return jsonify(result)
    except FileNotFoundError as e:
        return json.dumps(e)

@app.route('/api/convert', methods=['POST'])
def post():
    try:
        path = os.path.dirname(os.path.abspath(__file__))
        upload_folder=os.path.join(
        path.replace("/file_folder",""),"tmp")
        os.makedirs(upload_folder, exist_ok=True)
        app.config['upload_folder'] = upload_folder
    except Exception as e:
        app.logger.info('An error occurred while creating temp folder')
        app.logger.error('Exception occurred : {}'.format(e))

    if "file" not in request.files:
       return jsonify({"error": "No file"})

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Invalid filename"})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config.get('upload_folder'), filename)
        file.save(save_path)

        file = Path(save_path).stat().st_size
        reader = Reader()
        reader.read_file(f'./tmp/{filename}')
        shutil.rmtree(upload_folder) #remove tmp folder
        return json.loads(reader.to_json())

    return jsonify({"error": "Invalid file type"})


@app.route("/api/v2/")
def read_v2():
    try:
        reader = ReaderV2()
        reader.read_file("./testfiles/2023.pdf")
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
