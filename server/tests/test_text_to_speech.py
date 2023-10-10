import os
import project.google.TextToSpeech as TextToSpeech
import shutil

data = {
    'filename': 'Episode_s01e77__TI_vecka_16_2023_-_Dramatify.pdf',
    'id': '64b5fc73-4667-4886-a3e8-e47e8cc3cce2',
    'scenes': [
        {
            'id': '7706 INT. KÄLLAREN',
            'data': [
                {
                    'id': '3a6d3e51-2671-4260-a5df-4a328cf4c6e3',
                    'lines': 'Kommer nu',
                    'name': 'ALEXANDER',
                    'type': 'ACTOR'
                },
                {
                    'id': '1e48525b-7ae2-48e5-8a46-2e0079603f5',
                    'lines': 'Okej! Nu tar vi det utan den där',
                    'name': 'ELENDA',
                    'type': 'ACTOR'
                }
            ] 
        }
    ]
}

                                    

def test_should_create_correct_folder_structure() -> None:
    TextToSpeech.create_folders(data)

    root_folder_path = f'processed_audio/{data["id"]}'

    assert os.path.exists(root_folder_path), f"The folder '{root_folder_path}' does not exist."

    scene_folders = [scene["id"] for scene in data["scenes"]]

    subfolder_path = os.path.join(root_folder_path, f"{data['id']}")
   
    for folder in scene_folders:
        subfolder_path = os.path.join(root_folder_path, folder)
        assert os.path.exists(subfolder_path), f"The subfolder '{subfolder_path}' does not exist."

    shutil.rmtree(root_folder_path)


def test_should_created_mp3_files_in_correct_folders(test_client) -> None:
    TextToSpeech.create_folders(data)
    TextToSpeech.create_audio(data)

    root_folder_path = f'processed_audio/{data["id"]}'

    path_to_first_scene = f'{root_folder_path}/{data["scenes"][0]["id"]}'
    mp3_files = [file for file in os.listdir(path_to_first_scene) if file.endswith('.mp3')]

    expected_filenames = [line["id"]+".mp3" for line in data["scenes"][0]["data"]] # get line ids 

    for expected_filename in expected_filenames:
       assert expected_filename in mp3_files, f"Expected filename '{expected_filename}' not found in the subfolder: {path_to_first_scene}"
    
    shutil.rmtree(root_folder_path)