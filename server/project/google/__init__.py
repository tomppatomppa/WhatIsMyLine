from flask import Blueprint


google_blueprint = Blueprint('google', __name__)


from . import routes
