"""
This file (test_models.py) contains the unit tests for the models.py file.
"""

def test_new_user(new_user):
    # """
    # GIVEN a User model
    # WHEN a new User is created
    # THEN check the user_id, email, picture, provider, refresh_token, access_token, expiry
    # """
    assert new_user.user_id == '1234'
    assert new_user.picture == "picture_url"
    assert new_user.email == 'kalle@gmail.com'
    assert new_user.provider == 'google'
    assert new_user.__repr__() == '<User: kalle@gmail.com>'
    assert new_user.refresh_token == "12345"
 
    

    
