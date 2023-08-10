import os
import pytest
from dotenv import load_dotenv
from project import create_app
from utils import create_timestamp
from project.models import  User, Script
from project import db

load_dotenv()

@pytest.fixture(scope='module')
def new_user():
    user = User("1234","picture_url", 'kalle@gmail.com', "google", "12345")
    
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
    return {
        "script": script,
        "scenes": scenes
    } 




@pytest.fixture(scope='module')
def add_user_and_script_to_db(new_user, new_script):
    # Add user and script to the database
    with db.session.begin_nested():
        db.session.add(new_user)
        db.session.add(new_script["script"])
        db.session.commit()

    return new_user, new_script

@pytest.fixture(scope='module')
def test_client():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
    flask_app = create_app()

    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            yield testing_client

