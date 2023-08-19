import base64
import json
import os

url = "/api/drive/create_root_folder"

access_token = os.environ["TEST_ACCESS_TOKEN"]
test_folder_name = "test_dramatify-pdf-reader"

def test_scene_to_speech_endpoint(logged_in_test_client, csrf_headers, scene_item):
    """
    Functional api test for creating audio files for a scene.

    GIVEN a Flask application configured for testing,
    WHEN a logged-in user posts a scene from a script,
    THEN the response status code should indicate 200,
    AND the response data should have one item in response data
    AND the audio filename should equal scene_item id
    """
    headers = dict(csrf_headers) 
    headers["Authorization"] = f"Bearer {access_token}"
    response = logged_in_test_client.post(f"/api/drive/scene-to-speech", 
                                           json=scene_item,
                                           headers=headers)
    response_data = json.loads(response.data)
    
    assert response.status_code == 200
    assert len(response_data) == 1

    filename = f"{scene_item['scenes'][0]['data'][0]['id']}.mp3"
    assert response_data[0]["name"] == filename
   

def test_download_scene_audio(logged_in_test_client, csrf_headers, scene_item):
    """
    Functional API test for downloading audio files for a scene.

    GIVEN a Flask application configured for testing,
    WHEN a logged-in user requests to download audio for a scene,
    THEN the response status code should indicate 200,
    AND the response data should contain a list of audio items
    AND each audio item should have the necessary attributes: 'content', 'id', and 'name'
    AND the 'content' of each audio item should be in base64 format
    """
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
    assert len(response_data["files"]) == len(scene_item["scenes"][0]["data"])
    for file in response_data["files"]:
        assert isinstance(file, dict)
        assert "content" in file
        assert "id" in file
        assert "filename" in file
        assert base64.b64decode(file["content"].encode('utf-8'))
        assert isinstance(file["id"], str)
        assert isinstance(file["filename"], str)

    
    
   

def test_delete_folder(create_test_folder, logged_in_test_client, csrf_headers):
    headers = dict(csrf_headers) 
    headers["Authorization"] = f"Bearer {access_token}"
    response = logged_in_test_client.delete(f"/api/drive/{create_test_folder['id']}", headers=headers)
  
    assert response.status_code == 200
    assert response.data == f"Folder with the id {create_test_folder['id']} delete succesfully".encode()

