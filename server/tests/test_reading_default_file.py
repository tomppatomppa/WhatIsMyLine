from PyMuReaderV3 import ReaderV3
import os
testfile = "testfile.pdf"
folder_path = os.path.abspath("uploaded_files")

testfile_scenes = ["SCRIPT DETAILS","12102 INT. LOTUS RUM", "12104 INT. LOTUS RUM", "12109 INT. LOTUS RUM", "12111 INT. LOTUS RUM", "12118 INT. LOTUS RUM", "12116 INT. LOTUS RUM","13711 INT. KÄLLAREN", "12203 INT. LABBRÅTTORNAS LABB", "12805 INT. LABBRÅTTORNAS LABB",
                    "12809 INT. LABBRÅTTORNAS LABB", "13205 INT. VIKINGMUSVÅNINGEN", "13312 INT. VIKINGAMUSVÅNINGEN", "13510 INT. VIKINGMUSVÅNINGEN", "14404 INT. KONTROLLRUMMET",
                    "14414 INT. KONTROLLRUMMET", "14418 INT. KONTROLLRUMMET", "14421 INT. KONTROLLRUMMET" ,"14503 INT. KONTROLLRUMMET"]



def test_uploaded_files_folder_exists() -> None:
    folder_exists = os.path.exists(folder_path)
    assert folder_exists

def test_testfile_exists() -> None:
    file_exists = os.path.exists(f"{folder_path}/{testfile}")
    assert file_exists

def test_reader_reads_file() -> None:
    reader = ReaderV3()
    reader.read_file(testfile)
    assert reader.filename == testfile

def test_reader_to_json_outputs_correct_scene_ids() -> None:
    reader = ReaderV3()
    reader.read_file(testfile)
    result = reader.to_json()
    print(result)
    for scene in result["scenes"]:
        print(scene["id"])
        assert scene["id"] in testfile_scenes
    
def test_reader_to_json_outputs_correct_scene_ids() -> None:
    reader = ReaderV3()
    reader.read_file(testfile)
    result = reader.to_json()
    assert len(result["scenes"]) == 19
   
    
