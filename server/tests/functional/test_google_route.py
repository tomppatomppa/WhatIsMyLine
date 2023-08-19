import json
import os

url = "/api/drive/create_root_folder"

access_token = os.environ["TEST_ACCESS_TOKEN"]
test_folder_name = "test_dramatify-pdf-reader"

def test_scene_to_speech_endpoint(logged_in_test_client, csrf_headers, scene_item):
    headers = dict(csrf_headers) 
    headers["Authorization"] = f"Bearer {access_token}"
    response = logged_in_test_client.post(f"/api/drive/scene-to-speech", 
                                           json=scene_item,
                                           headers=headers)
    response_data = json.loads(response.data)
    
    assert response.status_code == 200
    assert len(response_data) == 1
   

def test_download_scene_audio(logged_in_test_client, csrf_headers, scene_item):
    headers = dict(csrf_headers) 
    headers["Authorization"] = f"Bearer {access_token}"

    data = {
        "rootId": scene_item["rootFolderId"],
        "scriptId": scene_item["id"],
        "sceneId": scene_item["scenes"][0]["id"],
        "lines":  scene_item["scenes"][0]["data"]
    }

    response = logged_in_test_client.post(f"/api/drive/download", json=data, headers=headers)
    response_data = json.loads(response.data)

    assert response.status_code == 200
    assert len(response_data) == 1
    # assert isinstance(response_data[0], bytearray)
 

def test_delete_folder(create_test_folder, logged_in_test_client, csrf_headers):
    headers = dict(csrf_headers) 
    headers["Authorization"] = f"Bearer {access_token}"
    response = logged_in_test_client.delete(f"/api/drive/{create_test_folder['id']}", headers=headers)
  
    assert response.status_code == 200
    assert response.data == f"Folder with the id {create_test_folder['id']} delete succesfully".encode()

