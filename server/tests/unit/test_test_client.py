def test_client_cookies(test_client):
    '''
    Api test for test client. 
        
    GIVEN a Flask application configured for testing,
    WHEN a sending request to /access_token
    THEN response should container JWT and CSRF cookie
    '''
    response = test_client.get("/access_token")
    cookies = response.headers.getlist("Set-Cookie")
    assert len(cookies) == 2  # JWT and CSRF value




