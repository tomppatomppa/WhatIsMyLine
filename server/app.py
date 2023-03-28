from flask import Flask, render_template
from pyMuReader import Reader
import json

app = Flask(__name__, static_folder="build/static", template_folder="build")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/testfile")
def read_testfile():
    try:
        reader = Reader()
        reader.read_file("./testfiles/default.pdf")
        result = json.loads(reader.to_json())
        return  [result]
    except FileNotFoundError as e:
        return json.dumps(e)
    