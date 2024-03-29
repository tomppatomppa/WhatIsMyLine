from datetime import datetime, timedelta
from http.client import HTTPException
from time import sleep
from google.auth.exceptions import GoogleAuthError, InvalidValue
from google.oauth2 import id_token
from google.auth.transport import requests
import re
import os
import shutil

CLIENT_ID = os.getenv("CLIENT_ID")

def create_timestamp(expires_in = 0):
    timestamp = datetime.now()
    new_timestamp = timestamp + timedelta(seconds=expires_in)
    return int(new_timestamp.timestamp())

def remove_dir(directory_path):
    try:
        shutil.rmtree(directory_path)
        return 'Directory deleted successfully'
    except OSError as e:
        return f'Error deleting directory: {e}'
    
def verify_google_id_token(token):
    try:
        payload = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
    except ValueError as err:
        str_err = str(err)
        #Workaround for localhost clock being out of sync
        if isinstance(err, InvalidValue) and str_err.find("Token used too early") > -1:
            sleep(time_difference(str_err))
            return id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
    
        raise HTTPException(
            status_code=401, detail="Unable to verify token"
        ) from err
    except GoogleAuthError as err:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch public key certificates",
        ) from err

    return payload



'''
Find two integers in string divided by < and calculate difference

Used for fixing "Token used too early" error caused by out of sync
    clock between google servers and localhost
'''
def time_difference(str):
    match = re.search(r"(\d+)\s*<\s*(\d+)", str)
    
    if match:
        first_number = int(match.group(1))
        second_number = int(match.group(2))
        return second_number - first_number
    
    return 0