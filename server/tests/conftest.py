import os
from flask import jsonify, request
import pytest
from dotenv import load_dotenv
from PyMuReaderV3 import ReaderV3
from ScriptReader import ScriptReader
from project import create_app, db
from project.models import  User, Script
from flask_jwt_extended import create_access_token, set_access_cookies
import json

load_dotenv()

GOOGLE_USER_ID = "1234"

@pytest.fixture(scope='module')
def new_user():
    user = User(GOOGLE_USER_ID , "picture_url", 'kalle@gmail.com', "google", "12345")
    
    return user

@pytest.fixture(scope='module')
def new_script(new_user):
    scenes = [{"id": "1", "data": [{"id": "2", "type": "INFO", "name": "", "lines": "testline"}]} ]
   
    script = Script(
                   "e2e78d9c-4e3b-4665-8932-bf8efb385bf6",
                   'filename.pdf',
                   new_user.user_id,
                   scenes
                   )
    return script

@pytest.fixture(scope='module')
def init_database(test_client, new_user, new_script):
    
    #db.create_all()
    
    # db.session.add(new_user)
    # db.session.commit()
  
    # db.session.add(new_script)
    # db.session.commit()
        
    yield
    
    db.drop_all()

@pytest.fixture(scope='module')
def test_client():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
   
    flask_app = create_app()
    
    @flask_app.route("/access_token", methods=["GET"])
    def access_token():
        resp = jsonify(login=True)
        access_token = create_access_token(GOOGLE_USER_ID, expires_delta=False)
        
        set_access_cookies(resp, access_token)
        return resp
    
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            yield testing_client


@pytest.fixture(scope='function')
def logged_in_test_client(test_client):
    '''
    Fake logs in user by doing a request to /access_token to test_client api
    Used to access protected api routes that have jwt_required() decorator
    '''
    test_client.get('/access_token')
  
    return test_client

@pytest.fixture(scope='function')
def csrf_headers(logged_in_test_client):
    response = logged_in_test_client.get("/access_token")
    csrf_access_token = _get_cookie_from_response(response, "csrf_access_token")["csrf_access_token"]
    headers = {"X-CSRF-TOKEN": csrf_access_token}
    return headers

def _get_cookie_from_response(response, cookie_name):
    cookie_headers = response.headers.getlist("Set-Cookie")
    for header in cookie_headers:
        attributes = header.split(";")
        if cookie_name in attributes[0]:
            cookie = {}
            for attr in attributes:
                split = attr.split("=")
                cookie[split[0].strip().lower()] = split[1] if len(split) > 1 else True
            return cookie
    return None

'''
Google Drive
'''
@pytest.fixture(scope='function')
def create_test_folder(logged_in_test_client, csrf_headers):
    access_token = os.environ["TEST_ACCESS_TOKEN"]
    headers = dict(csrf_headers)
    headers["Authorization"] = f"Bearer {access_token}"
    
    test_folder = logged_in_test_client.post("/api/drive/create_root_folder", json={"folderName": "test_dramatify-pdf-reader"}, headers=headers)
    test_folder_data = json.loads(test_folder.data)
    
    yield test_folder_data

@pytest.fixture(scope='function')
def scene_item(create_test_folder):
    return {
        "rootFolderId": create_test_folder['id'],
        "scenes": [{"id": "2", "data": [{"id": "4", "lines": "hello world"}]}],
        "id": "3"
    }                               



'''
PyMuReader

'''
@pytest.fixture(scope="module")
def reader_with_testfile():
    reader = ReaderV3()
    reader.read_file("testfile.pdf")
    yield reader

@pytest.fixture(scope="function")
def testfile_scenes(reader_with_testfile):
    scenes = reader_with_testfile.to_json()["scenes"]
    
    yield scenes

'''
ScriptReader

'''
@pytest.fixture(scope="module")
def script_reader_with_file():
    reader = ScriptReader()
    reader.read_file("1.9.pdf")
    yield reader