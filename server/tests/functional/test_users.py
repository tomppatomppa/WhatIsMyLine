
def test_login_page_with_no_auth_code(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/login' page is requested (POST)
    THEN check the response is valid
    """
    response = test_client.post('/login', json={})

    # Update the following assertions based on your expected response
    assert response.status_code == 403
    assert  b"Missing 'code' parameter in the request." in response.data
  

def test_login_page_with_invalid_auth_code(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/login' page is requested with invalid code (POST)
    THEN check the response is 400 and reason is auth code
    """
    response = test_client.post('/login', json={"code": "1234"}, content_type='application/json')

    # Update the following assertions based on your expected response
    assert response.status_code == 400
    assert response.get_json() == {
        "error": "invalid_grant",
        "error_description": "Malformed auth code."
        }
    # Add more assertions as needed

