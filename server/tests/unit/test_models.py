"""
This file (test_models.py) contains the unit tests for the models.py file.
"""
from project.models import User
from utils import create_timestamp


def test_new_user():
    pass
    # """
    # GIVEN a User model
    # WHEN a new User is created
    # THEN check the user_id, email, picture, provider, refresh_token, access_token, expiry
    # """
    user = User("1234","picture_url", 'kalle@gmail.com', "google", "12345", "access_token", create_timestamp())
    assert user.user_id == '1234'
    assert user.picture == "picture_url"
    assert user.email == 'kalle@gmail.com'
    assert user.provider == 'google'
    assert user.__repr__() == '<User: kalle@gmail.com>'
    assert user.refresh_token == "12345"
    assert user.access_token == "access_token"
    assert user.expiry # assert it exists
    
