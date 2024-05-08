
from flask_jwt_extended import jwt_required
from . import auth_blueprint

@auth_blueprint.route("/auth", methods=["GET"])
@jwt_required()
def refresh():
    '''
    Verify user is logged in
    '''
    try:
        return 200
    except:
        return 401
