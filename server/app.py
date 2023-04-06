from flask import Flask,request, render_template
from PyMuReaderV3 import ReaderV3
from flask_cors import CORS
import json
from config import allowed_file, create_upload_folder,process_uploaded_file_v3


app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)

create_upload_folder(app)

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.route("/api/v3/")
def read_v3():
    try:
        reader = ReaderV3()
        reader.read_file("testfile.pdf")
        result = reader.to_json()
        return json.dumps(result)   
    except FileNotFoundError as e:
        return json.dumps(e)


@app.route("/api/v3/upload", methods=['POST'])
def upload_v3():

    if "file" not in request.files:
       return 'No file', 500

    file = request.files['file']
    if file.filename == '':
        return 'Invalid filename', 403

    if file and allowed_file(file.filename):
        #create_temp_folder(app)
        return process_uploaded_file_v3(file, app)

    return 'Invalid filetype', 403

