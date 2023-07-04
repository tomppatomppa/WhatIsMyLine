from flask import Blueprint

upload_blueprint = Blueprint('upload', __name__, template_folder='templates')

from . import routes
