import os
import uuid
from werkzeug.utils import secure_filename
from PyMuReaderV3 import ReaderV3
import os
import json

def allowed_file(filename):   
    ALLOWED_EXTENSIONS = {'pdf'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_uuid_filename():
    uid = uuid.uuid4()
    uuid_filename = f'{str(uid)}.pdf'
    return uuid_filename

def create_upload_folder(app):
    try:
        path = os.path.dirname(os.path.abspath(__file__))
        upload_folder = os.path.join(path.replace("/file_folder",""), "uploaded_files")
        os.makedirs(upload_folder, exist_ok=True)
        app.config['uploaded_files_folder'] = upload_folder
    except Exception as e:
        app.logger.info('An error occurred while creating folder')
        app.logger.error('Exception occurred : {}'.format(e))

def process_uploaded_file_v3(file, app):
    try:
        filename = secure_filename(file.filename)

        #Create unique filename to avoid duplicates
        uuid_filename = create_uuid_filename()
        save_path = os.path.join(app.config.get('uploaded_files_folder'), uuid_filename)
        file.save(save_path)
        
        reader = ReaderV3()
        reader.read_file(f'{uuid_filename}')

        result = reader.to_json()
        result["filename"] = filename

        return json.dumps(result)
    
    finally:
        os.remove(save_path)
