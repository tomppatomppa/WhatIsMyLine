
import requests
from . import users_blueprint
from flask import redirect, request, url_for, jsonify
import os
from flask_login import  current_user, login_required, login_user, logout_user
from utils import create_timestamp, verify_google_id_token, get_refresh_token
from project.models import User
from flask_jwt_extended import create_access_token, JWTManager, jwt_required,set_access_cookies, get_jwt_identity, unset_jwt_cookies


from project import db
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")


@users_blueprint.route("/login", methods=["POST"])
def login():
    code = request.json.get('code')
    
    try:
        response = requests.post('https://oauth2.googleapis.com/token', data={
            'code': code,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'redirect_uri': "postmessage",
            'grant_type': 'authorization_code',
            'scope': ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive.file"]
        })
        
        token_data = response.json()

        if response.status_code == 200 and token_data:
            user = verify_google_id_token(token_data.get("id_token"))
            user_id = user.get("sub")
            refresh_token = token_data.get("refresh_token")
            access_token = token_data.get("access_token")
            expiry = create_timestamp(token_data.get("expires_in"))

            user_exists = User.query.filter_by(user_id=user_id).first()
            #Add new user to db
            if not user_exists:
                user_exists = User(user_id,
                                   user.get("picture"),
                                   user.get("email"),
                                   "google",
                                   refresh_token,
                                   access_token,
                                   expiry)
                
            db.session.add(user_exists)
            db.session.commit()
            user["access_token"] = access_token
            user["expiry"] = expiry

            jwt_token = create_access_token(identity=user_id)
            response = jsonify(user)
            set_access_cookies(response, jwt_token) 
                
            return response
        
        return response.json(), response.status_code
    except:
        return 'Failed to login', 401



@users_blueprint.route("/refresh_token",  methods=["POST"])
@jwt_required()
def refresh_token():
    user_id = get_jwt_identity()
    refresh_token = get_user(user_id).refresh_token

    payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
    }
    try:
        response = requests.post('https://oauth2.googleapis.com/token', data=payload)
        response.raise_for_status()
        token_data = response.json()
        new_access_token = token_data.get('access_token')

        return new_access_token, 200
    except requests.exceptions.RequestException as e:
        error_message = str(e)
        return {'error': error_message}, 400
    

@users_blueprint.route("/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify("logout successful")
    unset_jwt_cookies(response)
    return response

@users_blueprint.route("/user", methods=["GET", "POST"])
@jwt_required()
def users():
    user_id = get_jwt_identity()
    user = get_user(user_id)
    if user:
        return jsonify(user.email)
    return jsonify("Invalid request")


def get_user(user_id):
    return User.query.filter_by(user_id=user_id).first()