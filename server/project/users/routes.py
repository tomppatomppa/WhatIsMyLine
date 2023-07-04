import requests
from . import users_blueprint
from flask import request
import os

from utils import create_timestamp, verify_google_id_token, get_refresh_token

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
            #create session for user
            user = verify_google_id_token(token_data.get("id_token"))
            user["access_token"] = token_data.get("access_token")
            user["expiry"] = create_timestamp(token_data.get("expires_in")  )
            return user, 200
    except:
        return 'Failed to login', 401



@users_blueprint.route("/refresh_token",  methods=["POST"])
def refresh_token():
    user_id = request.json.get("user_id")
    payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': get_refresh_token(user_id),
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
