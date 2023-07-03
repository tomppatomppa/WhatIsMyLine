from __future__ import print_function
from googleapiclient.errors import HttpError
import requests

base_url = "https://www.googleapis.com/drive/v3/files"
SCOPES = ["https://www.googleapis.com/auth/drive"]

def search_folder(access_token):
    """Search root folder in drive location

    :param access_token: Access token for authentication
    """
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    try:
        files = []
        page_token = None
        while True:
            params = {
                'q': "'root' in parents and mimeType = 'application/vnd.google-apps.folder' and fullText contains 'dramatify-pdf-reader' and trashed=false",
                'spaces': 'drive',
                'fields': 'nextPageToken, files(id, name)',   
            }
            response = requests.get(base_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
           
            for file in data.get('files', []):
                # Process file
                print(f"Found file: {file.get('name')}, {file.get('id')}")
                files.append(file)

            page_token = data.get('nextPageToken')
            if not page_token:
                break

    except HttpError as error:
        print(F'An error occurred: {error}')
        files = None
    
    if len(files) == 1:
        return files[0]
    return files
     
