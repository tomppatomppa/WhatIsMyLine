import os

url = "/api/create_root_folder"

access_token = os.environ["TEST_ACCESS_TOKEN"]

def test_create_root_folder_endpoint(logged_in_test_client, csrf_headers):
    headers = dict(csrf_headers)  # Make a copy of the CSRF headers
    headers["Authorization"] = f"Bearer {access_token}"
    
    response = logged_in_test_client.post(url, headers=headers)

    assert response.status_code == 200
    assert response.data == b"[]\n"