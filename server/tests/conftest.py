import os
import pytest
from dotenv import load_dotenv
from project import create_app, db
from project.models import  User, Script

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
def init_database(test_client):
    # Create the database and the database table
    db.create_all()

    # Insert user data
    default_user = User("1234","picture_url", 'kalle@gmail.com', "google", "12345")
  
    db.session.add(default_user)
    # Commit the changes for the users
    db.session.commit()

    # Insert script data
    scenes = [{"id": "1", "data": [{"id": "2", "type": "INFO", "name": "", "lines": "testline"}]} ]
    script1 = Script(
                   "e2e78d9c-4e3b-4665-8932-bf8efb385bf6",
                   'filename.pdf',
                   default_user.user_id,
                   scenes
                   )
    
    db.session.add(script1)

    db.session.commit()
    
    yield

    db.drop_all()




@pytest.fixture(scope='module')
def test_client():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
    flask_app = create_app()

    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            yield testing_client

@pytest.fixture(scope='module')
def authenticated_client(testing_client):
    # Simulate dummy login and set cookies
    with testing_client.session_transaction() as session:
        session['user_id'] = 'user123'  # Simulate authenticated user

    return testing_client