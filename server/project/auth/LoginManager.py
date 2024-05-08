import requests
import os
from datetime import datetime, timedelta
from http.client import HTTPException
from time import sleep
from google.auth.exceptions import GoogleAuthError, InvalidValue
from google.oauth2 import id_token
from google.auth.transport import requests as req
import re
import os
import shutil

from utils import time_difference
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

class LoginManager():
    def __init__(self, code):
        self.code = code

    def refreshCookie(self):
        print("refresh")
        
    def verify_token(self, token):
        try:
            payload = id_token.verify_oauth2_token(token, req.Request(), CLIENT_ID)
        except ValueError as err:
            str_err = str(err)
            #Workaround for localhost clock being out of sync
            if isinstance(err, InvalidValue) and str_err.find("Token used too early") > -1:
                sleep(time_difference(str_err))
                return id_token.verify_oauth2_token(token, req.Request(), CLIENT_ID)
        
            raise HTTPException(
                status_code=401, detail="Unable to verify token"
            ) from err
        except GoogleAuthError as err:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch public key certificates",
            ) from err

        return payload
    
    def login(self):
        return requests.post('https://oauth2.googleapis.com/token', data={
            'code': self.code,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'redirect_uri': "postmessage",
            'grant_type': 'authorization_code',
            'scope': ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive.file"]
        })
        
        
         
        