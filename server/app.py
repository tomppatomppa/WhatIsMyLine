from flask import Flask, render_template, jsonify
from pyMuReader import Reader
from flask_cors import CORS
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
    