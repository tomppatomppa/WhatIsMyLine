import os
from google.cloud import texttospeech


credentials_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

def text_to_mp3(folder_id, scene_id, line_id, text):
    print(credentials_path)
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        name="sv-SE-Wavenet-E",
        language_code="sv-SE",
        ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )


    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    filename = f"{line_id}.mp3"
    with open(f"processed_audio/{folder_id}/{scene_id}/{filename}", "wb") as out:
        # Write the response to the output file.
        out.write(response.audio_content)


'''
Root folder === script["id"]
sub folder(s) === scene["id"]

Creates the following folder strucure
    Root -
        sub_folder-
        sub_folder-
           
'''
def create_folders(data):
    folder_id = data["id"]
    scene_ids = [scene["id"] for scene in data["scenes"]]
    try:
        os.makedirs(f"processed_audio/{folder_id}", exist_ok=True)
        for scene_id in scene_ids:   
            os.makedirs(f"processed_audio/{folder_id}/{scene_id}", exist_ok=True)
        return True
    except OSError as error:
        print("Directory '%s' can not be created")
  
'''
Populates folders with audio files received from google text-to-speech api

'''
def create_audio(data):
    for scene in data["scenes"]:
        for line in scene["data"]:
            text_to_mp3(data["id"], scene["id"], line["id"], line["lines"])


def create_data(data):
    create_folders(data)
    create_audio(data)




