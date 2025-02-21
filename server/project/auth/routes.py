
from flask import jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, unset_jwt_cookies, unset_refresh_cookies
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
    unset_refresh_cookies(response)
    return response


@auth_blueprint.route("/refresh-cookie", methods=["POST"])
@jwt_required(refresh=True)
def refresh_cookie():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    response = jsonify("OK")
    set_access_cookies(response, access_token)
    return response