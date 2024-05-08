import requests
import os

from project.auth.LoginManager import LoginManager
from . import users_blueprint

from flask import request, jsonify
from utils import create_timestamp, verify_google_id_token
from project.models import User
from flask_jwt_extended import create_access_token, jwt_required,set_access_cookies, get_jwt_identity, unset_jwt_cookies

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")


@users_blueprint.route("/login", methods=["POST"])
def login():
    code = request.json.get('code')

    if not code:
        return "Missing 'code' parameter in the request.", 403 
    try:
        response = LoginManager(code).login() #get_token_data(code)
        if response.status_code == 200:
            token_data = response.json()
            user = verify_google_id_token(token_data.get("id_token"))
            user_for_database, user_for_client = extract_user_info(user, token_data)
            user = store_user(user_for_database)
            
            response = jsonify(user_for_client)
            access_token = create_access_token(identity=user.id)
            
            set_access_cookies(response, access_token) 
            
            return response
        return response.json(), response.status_code
    except ValueError as valueError:
        return str(valueError), 406
    except:
        return "Failed to login", 401

@users_blueprint.route("/refresh-token", methods=["POST"])
@jwt_required()
def refresh():
    '''
    Refresh clients access token for google services (e.g google drive)
    '''
    try:
        user_id = get_jwt_identity()
        
        refresh_token = User.get_refresh_token_by_user_id(user_id)
        if not refresh_token:
            return "Missing 'refresh_token' login again.", 401 
    
        access_token = refresh_access_token(refresh_token)
        expiry = create_timestamp(access_token.get("expires_in"))
        return jsonify({"access_token": access_token.get("access_token"), "expiry": expiry}), 200
    except:
        return "Failed to refresh token", 401

@users_blueprint.route("/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify("Logout successful")
    unset_jwt_cookies(response)
    return response

@users_blueprint.route("/user", methods=["GET", "POST"])
@jwt_required()
def users():
    user = User.get_user_by_user_id(get_jwt_identity())
    if user:
        return jsonify(user.email)
    return jsonify("Invalid request")


'''
Helper Functions
'''
def extract_user_info(user, token_data):
    user_id = user.get("sub")
    refresh_token = token_data.get("refresh_token")
    access_token = token_data.get("access_token")
    expiry = create_timestamp(token_data.get("expires_in"))

    user_for_database = {
        "user_id": user_id,
        "refresh_token": refresh_token,
        "picture": user.get("picture"),
        "email": user.get("email"),
        "provider": "google" # No Plans for other providers    
    }
    user_for_client = {
        "email": user.get("email"),
        "picture": user.get("picture"),
        "access_token": access_token,
        "expiry": expiry
    }
    return user_for_database, user_for_client

def get_token_data(code):
    response = requests.post('https://oauth2.googleapis.com/token', data={
            'code': code,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'redirect_uri': "postmessage",
            'grant_type': 'authorization_code',
            'scope': ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive.file"]
        })
        
    return response

def store_user(user_info) -> User:
   
    user = User.find_or_create_user(user_info)

    if not user:
        raise ValueError("User not found or could not be created")

    return user
   
    #User.update_refresh_token_by_user_id(user_info["user_id"], user_info["refresh_token"])
    
def refresh_access_token(refresh_token):
    
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
        
        return token_data
    except requests.exceptions.RequestException as e:
        error_message = str(e)
        return {'error': error_message}, 400
    
