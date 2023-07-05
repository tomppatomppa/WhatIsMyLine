from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user, verify_jwt_in_request, get_jwt_identity
from project.models import User

google_blueprint = Blueprint('google', __name__, template_folder='templates')



from . import routes
