import os

url = "/api/drive/create_root_folder"

access_token = os.environ["TEST_ACCESS_TOKEN"]
test_folder_name = "test_dramatify-pdf-reader"


# def test_create_root_folder_endpoint(logged_in_test_client, csrf_headers):
#     headers = dict(csrf_headers)  # Make a copy of the CSRF headers
#     headers["Authorization"] = f"Bearer {access_token}"
    
#     response = logged_in_test_client.post(url, json={"folder_name": test_folder_name}, headers=headers)

#     assert response.status_code == 200
#     assert response.data != b"[]\n"



def test_delete_folder(create_test_folder, logged_in_test_client, csrf_headers):
    headers = dict(csrf_headers) 
    headers["Authorization"] = f"Bearer {access_token}"
    response = logged_in_test_client.delete(f"/api/drive/{create_test_folder['id']}", headers=headers)
    
    assert response.status_code == 200
    assert response.data == f"Folder with the id {create_test_folder['id']} delete succesfully".encode()