from flask import Flask, render_template
from pyMuReader import Reader
app = Flask(__name__, static_folder="build/static", template_folder="build")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/hello")
def hello():
    reader = Reader()
    result = reader.read_file("default.pdf")
    return result