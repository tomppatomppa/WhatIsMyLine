
from flask import jsonify
from flask_jwt_extended import jwt_required, unset_jwt_cookies
from . import auth_blueprint

@auth_blueprint.route("/auth", methods=["GET"])
@jwt_required()
def refresh():
    '''
    Verify user is logged in
    
    '''
    print("HERE")
    try:
        return 'success', 200
    except:
        return 'logout', 401

@auth_blueprint.route("/auth/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify("Logout successful")
    unset_jwt_cookies(response)
    return response