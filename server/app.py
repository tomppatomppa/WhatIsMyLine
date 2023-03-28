from flask import Flask, render_template, jsonify
from pyMuReader import Reader
from flask_cors import CORS
import os
import json

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)

@app.route("/")
def index():
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

@app.route('/pass', methods=['POST'])
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