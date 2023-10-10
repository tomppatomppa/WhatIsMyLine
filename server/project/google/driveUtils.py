import io
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload


base_url = "https://www.googleapis.com/drive/v3/files"


def search_folder(service, parent_id, folder_name):
    try:
        files = []
        page_token = None
        while True:
            response = service.files().list(q=f"'{parent_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and fullText contains '{folder_name}' and trashed=false",
                                            spaces='drive',
                                             fields='nextPageToken, '
                                                   'files(id, name)',
                                            pageToken=page_token).execute()
            files.extend(response.get('files', []))
            
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break

    except HttpError as error:
        print(F'An error occurred: {error}')
        files = None

    return files

def create_folder(service, parent_id, folder_name):
    try:
        file_metadata = {
            'name': f'{folder_name}',
            'mimeType': 'application/vnd.google-apps.folder'
        }
        if parent_id:
            file_metadata['parents'] = [parent_id]

        file = service.files().create(body=file_metadata, fields='id').execute() 
                                      
        return file

    except HttpError as error:
        print(F'An error occurred: {error}')
        return None
    
def delete_folder_by_id(service, folder_id):
    try:
        service.files().delete(fileId=folder_id).execute()
        return True
    except HttpError as error:
        print(F'An error occurred: {error}')
        return False

def find_or_create_folder(service, parent_id, folder_name):
    '''
    Find an existing folder with the specified name in the parent folder,
    or create it if it doesn't exist
    '''
    try:
        existing_folder = search_folder(service, parent_id, folder_name)
        
        if existing_folder:
            return existing_folder[0] #TODO: if len > 1 ?
   
        created_folder = create_folder(service, parent_id, folder_name)
        return created_folder
    
    except HttpError as error:
        print(f'An error occurred: {error}')
        return None 

def upload_audio_to_drive(service, parent_folder_id, filepath):
    filename = filepath.split('/')[-1]

    metadata = {
        'name': f'{filename}',
        'parents': [parent_folder_id]
    }

    media = MediaFileUpload(filepath, mimetype='audio/mpeg')
    
    try:
        # Find file in folder
        query = f"'{parent_folder_id}' in parents and name='{metadata['name']}' and trashed=false"
        results = service.files().list(q=query, fields='files(id)').execute()
        existing_files = results.get('files', [])

        if existing_files:
            existing_file_id = existing_files[0]['id']
            response = service.files().update(fileId=existing_file_id, body=None, media_body=media).execute()
        else:
            # Upload the file if it doesn't exist
            response = service.files().create(body=metadata, media_body=media).execute()

        return response
        
    except HttpError as error:
        print(f'An error occurred: {error}')
        return None

def download_file(service, file_id):
    try:
        request = service.files().get_media(fileId=file_id)
        downloaded_file = io.BytesIO()
        downloader = MediaIoBaseDownload(downloaded_file, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
        
        return downloaded_file.getvalue()

    except HttpError as error:
        print(f'An error occurred: {error}')
        return None

def list_audio_files_in_folder(service, folder_id):
    try:
        results = service.files().list(q=f"'{folder_id}' in parents and mimeType='audio/mpeg' and trashed=false", fields='files(id, name)').execute()
        files = results.get('files', [])
        return files
    except HttpError as error:
        print(f'An error occurred: {error}')
        return []

