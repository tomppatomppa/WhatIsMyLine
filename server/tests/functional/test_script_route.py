import json

url = '/api/script'

def test_retrieving_all_scripts_when_none_exists(test_client):

    response = test_client.get(url)
    print("Request URL:", response.request.url)

    assert response.status_code == 404
    assert response.data == b'No scripts found'

   
   
def test_retrieving_all_scripts(test_client, init_database, new_script, new_user):

    response = test_client.get(url)

    assert response.status_code == 200
    scripts = json.loads(response.data)
    
    assert len(scripts) == 1
    assert scripts[0]["script_id"] == new_script["script"].script_id
    assert scripts[0]["user_id"] == new_user.user_id

    
   
   
