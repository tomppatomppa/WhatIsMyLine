import json

url = '/api/script'


def test_retrieving_all_logged_in_user_scripts_when_none_exists(logged_in_test_client):
    response = logged_in_test_client.get(url)

    assert response.status_code == 404
    assert response.data == b'No scripts found'



def test_retrieving_all_scripts(logged_in_test_client, init_database, new_script, new_user):
    response = logged_in_test_client.get(url)

    assert response.status_code == 200
    scripts = json.loads(response.data)

    assert len(scripts) == 1
    assert scripts[0]["script_id"] == new_script.script_id
    assert scripts[0]["user_id"] == new_user.user_id

def test_retrieve_script_by_id(logged_in_test_client, new_script, new_user):
    script_id = new_script.script_id
    response = logged_in_test_client.get(f'{url}/{script_id}')

    assert response.status_code == 200
    
    response_json = json.loads(response.data)
    assert response_json["filename"] == new_script.filename
    assert response_json["script_id"] == new_script.script_id
    assert response_json["scenes"] == new_script.scenes
    assert response_json["user_id"] == new_user.user_id
  

def test_adding_new_script(logged_in_test_client,new_script, new_user, csrf_headers):
    script_to_add = {
       "script_id": "testscriptid",
        "filename": "filename.pdf",
        "scenes": [{"id": 1}]
    }

    response = logged_in_test_client.post(url, json=script_to_add, headers=csrf_headers)

    response_json = json.loads(response.data)    
    assert response.status_code == 200
    assert response_json["user_id"] == f'{new_user.user_id}'
    assert response_json["script_id"] == script_to_add["script_id"]
    assert response_json["filename"] == script_to_add["filename"]
    assert response_json["scenes"] == script_to_add["scenes"]

def test_deleting_script_by_id(logged_in_test_client, new_script, csrf_headers):

    response = logged_in_test_client.delete(f'{url}/{new_script.script_id}', headers=csrf_headers) 
    
    assert response.status_code == 200

def test_deleting_script_that_doesnt_exist(logged_in_test_client, csrf_headers):

    response = logged_in_test_client.delete(f'{url}/1234', headers=csrf_headers) 
    assert response.status_code == 404


def test_updating_existing_script(logged_in_test_client, csrf_headers):
    script_to_update = {
        "script_id": "not_allowed",
        "filename": "updatedfilename.pdf",
        "scenes": [{"id": 2}]
    }

    response = logged_in_test_client.put(f'{url}/testscriptid', json=script_to_update, headers=csrf_headers)
    
    assert response.status_code == 200

    response_json = json.loads(response.data)
   
    assert response_json["filename"] ==  script_to_update["filename"]  
    assert response_json["scenes"] ==  script_to_update["scenes"]
    #Should not be able to update script_id
    assert response_json["script_id"] !=  script_to_update["script_id"]  