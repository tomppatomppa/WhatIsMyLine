from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests
from jwt import (
    JWT,
    jwk_from_dict,
    jwk_from_pem,
)
import os
CLIENT_ID = os.getenv("CLIENT_ID")

def create_timestamp(expires_in = 0):
    timestamp = datetime.now()
    new_timestamp = timestamp + timedelta(seconds=expires_in)
    formatted_timestamp = new_timestamp.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
    return str(formatted_timestamp)


def get_user(token):
    
    ids = None
    with open('dummyDb.txt', 'r') as db:
        ids = db.read().splitlines()
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        user_id = idinfo['sub']
        if user_id in ids:
            print("Has logged before")
        else:
            ids.append(user_id)
            with open('dummyDb.txt', 'w') as db:
                db.write('\n'.join(ids))
        
        user = {"email": idinfo.get("email"),"name": idinfo.get("name"),"picture": idinfo.get("picture")}
        return user
    except ValueError:
        return None
    
