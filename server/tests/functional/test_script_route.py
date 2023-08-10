
import json
def test_retrieving_all_user_scripts(test_client, add_user_and_script_to_db):

    new_user, new_script = add_user_and_script_to_db

    # Make a request to the /script route, follow redirects
    response = test_client.get('/script', follow_redirects=True)

    assert response.status_code == 200
    response_data = json.loads(response.data)
    assert response_data == new_script["scenes"]
