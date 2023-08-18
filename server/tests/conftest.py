import os
from flask import jsonify, request
import pytest
from dotenv import load_dotenv
from project import create_app, db
from project.models import  User, Script
from flask_jwt_extended import create_access_token, set_access_cookies
import json
load_dotenv()

USER_ID = "1234"

@pytest.fixture(scope='module')
def new_user():
    user = User(USER_ID,"picture_url", 'kalle@gmail.com', "google", "12345")
    
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
    # Create the database and the database table
    db.create_all()

    db.session.add(new_user)
    db.session.commit()

    db.session.add(new_script)
    db.session.commit()
    
    yield
    
    db.drop_all()



@pytest.fixture(scope='module')
def test_client():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
    flask_app = create_app()
    
    @flask_app.route("/access_token", methods=["GET"])
    def access_token():
        domain = request.args.get("domain")
        resp = jsonify(login=True)
        access_token = create_access_token(USER_ID)
        set_access_cookies(resp, access_token, domain=domain)
        return resp
    
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            yield testing_client


@pytest.fixture(scope='function')
def logged_in_test_client(test_client):
    access_token = create_access_token(USER_ID)
    response = test_client.get('/access_token')
    set_access_cookies(response, access_token)
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
    
    test_folder = logged_in_test_client.post("/api/drive/create_root_folder", json={"folder_name": "test_dramatify-pdf-reader"}, headers=headers)
    test_folder_data = json.loads(test_folder.data)
    
    yield test_folder_data
    # yield test_folder_data
    
    # logged_in_test_client.delete(f"/api/drive/{test_folder_data['id']}", headers=headers)

def credentials_for_testing():
    if os.environ.get('FLASK_ENV') == 'testing':
        return {
            "refresh_token": os.environ["TEST_REFRESH_TOKEN"],
            "client_id": os.environ["CLIENT_ID"],
            "client_secret": os.environ["CLIENT_SECRET"],
            "token_uri": "https://oauth2.googleapis.com/token"
        }
    return {}
