from flask import Blueprint


scripts_blueprint = Blueprint('scripts', __name__, template_folder='templates')

from . import routes
