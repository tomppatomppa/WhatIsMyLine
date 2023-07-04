from __future__ import print_function
from googleapiclient.errors import HttpError
import requests
import json

base_url = "https://www.googleapis.com/drive/v3/files"

def search_folder(request):
    """Search root folder in drive location

    :param access_token: Access token for authentication
    """
    headers = {
        'Authorization': f'Bearer {request.json.get("access_token")}',
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
     
def create_root_folder(request):
    headers = {
        'Authorization': f'Bearer {request.json.get("access_token")}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'dramatify-pdf-reader',
        'mimeType': 'application/vnd.google-apps.folder'
    }

    try:
        response = requests.post(base_url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        return None


def create_folder(access_token, parent_id, folder_name):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'q': f"'{parent_id}' in parents and name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        'fields': 'files(id, name)'
    }

    try:
        response = requests.get(base_url, headers=headers, params=params)
        response.raise_for_status()
        folder_exists = bool(response.json().get('files')) 
        if not folder_exists:
            data = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent_id]
            }
            response = requests.post(base_url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()
        
        return response.json().get("files")[0]
    except requests.exceptions.RequestException as error:
        print(f'An error occurred: {error}')
        return None


def upload_mp3_to_drive(access_token, parent_folder_id, filepath):
    filename = filepath.split('/')[-1]
    url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'

    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    metadata = {
        'name': f'{filename}'
    }
    if parent_folder_id:
       metadata['parents'] = [parent_folder_id]
    
    files = {
        'metadata': ('metadata', json.dumps(metadata), 'application/json'),
        'file': (f'{filename}', open(filepath, 'rb'), 'audio/mpeg')
    }
   
    try:
        #find file in folder
        query_params = {
            'q': f"'{parent_folder_id}' in parents and name='{metadata['name']}' and trashed=false",
            'fields': 'files(id)'
        }
        existing_files_response = requests.get(base_url, headers=headers, params=query_params)
        existing_files_response.raise_for_status()
        existing_files = existing_files_response.json().get('files', [])
     
        if existing_files:
            existing_file_id = existing_files[0]['id']
            replace_url = f"https://www.googleapis.com/upload/drive/v3/files/{existing_file_id}"
            response = requests.patch(url=replace_url, headers=headers, files=files)
        else:
            # Upload the file if it doesn't exist
            response = requests.post(url, headers=headers, files=files)

        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as error:
        print(f'An error occurred: {error}')
        return None
  

