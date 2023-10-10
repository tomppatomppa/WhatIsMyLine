def test_client_cookies(test_client):
    response = test_client.get("/access_token")
    cookies = response.headers.getlist("Set-Cookie")
    assert len(cookies) == 2  # JWT and CSRF value
