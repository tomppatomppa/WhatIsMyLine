from flask_jwt_extended import get_jwt_identity, jwt_required

from project import db
from project.models import User, Script
from . import upload_blueprint
from flask import  request, current_app
from werkzeug.utils import secure_filename
import os
import uuid
from PyMuReaderV3 import ReaderV3
import json

@upload_blueprint.route("/v3/upload", methods=['POST'])
@jwt_required()
def upload_file():
    if "file" not in request.files:
       return 'No file', 406
   
    file = request.files['file']
    if file.filename == '':
        return 'Invalid filename', 403
    
    user: User = db.get_or_404(User,
                         get_jwt_identity(),
                         description=f"User doesn't exist")
    if not file or not allowed_file(file.filename):
        return 'Invalid filetype', 403
    try:
        folder = current_app.config.get('uploaded_files_folder')
        result = process_uploaded_file(file, folder)
        script = Script.add_script(result, user_id=user.id)
        return script.to_dict()
    except:
        return "Error uploading script", 404
   

    


def process_uploaded_file(file, uploaded_files_folder):
    try:
        filename = secure_filename(file.filename)
        #Create unique filename to avoid duplicates
        uuid_filename = create_uuid_filename()
        save_path = os.path.join(uploaded_files_folder, uuid_filename)
        file.save(save_path)
        
        
        reader = ReaderV3(line_id=True, lines_as_string=True)
        reader.read_file(f'{uuid_filename}')

        result = reader.to_json() 
        result["filename"] = filename
        return result
    
    finally:
        os.remove(save_path)


'''
Helper functions
'''
def create_uuid_filename():
    uid = uuid.uuid4()
    uuid_filename = f'{str(uid)}.pdf'
    return uuid_filename

def allowed_file(filename):   
    ALLOWED_EXTENSIONS = {'pdf'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
