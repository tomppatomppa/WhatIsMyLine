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
 
    

    
def test_new_script(new_script, new_user):
    script = new_script
    scenes = new_script.scenes
    # """
    # GIVEN a Script model
    # WHEN a new Script is created
    # THEN check the script_id, filename, user_id, scenes, created_on
    # """
    assert script.script_id == "e2e78d9c-4e3b-4665-8932-bf8efb385bf6"
    assert script.filename == 'filename.pdf'
    assert script.user_id == new_user.user_id
    assert script.scenes == scenes
    assert script.__repr__() == '<Script: filename.pdf>'
    
