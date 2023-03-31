import os



def allowed_file(filename):   
    ALLOWED_EXTENSIONS = {'pdf'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Function to create temporary folder for uploaded files
def create_temp_folder(app):
    try:
        path = os.path.dirname(os.path.abspath(__file__))
        upload_folder = os.path.join(path.replace("/file_folder",""), "tmp")
        os.makedirs(upload_folder, exist_ok=True)
        app.config['upload_folder'] = upload_folder
    except Exception as e:
        app.logger.info('An error occurred while creating temp folder')
        app.logger.error('Exception occurred : {}'.format(e))

