from flask import Blueprint

google_blueprint = Blueprint('google', __name__, template_folder='templates')

from . import routes
