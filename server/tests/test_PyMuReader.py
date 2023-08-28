import pytest
from PyMuReaderV3 import ReaderV3

import os

scene = {'12102 INT. LOTUS RUM': [{'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'Lotus och en Beundrarmus sitter och fnissar i Lotus rum,', 'origin': (96.15774536132812, 181.76541137695312), 'bbox': (96.15774536132812, 171.93505859375, 492.9061584472656, 185.31126403808594)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'de spionerar på Tika. (kannellinen lasipurkki jossa', 'origin': (96.15774536132812, 193.5733642578125), 'bbox': (96.15774536132812, 
183.74301147460938, 457.48236083984375, 197.1192169189453)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'lappuja, lapuissa on eläinkuvia, lasipurkin päällä lappu', 'origin': (96.15774536132812, 205.38131713867188), 'bbox': (96.15774536132812, 195.55096435546875, 492.9061584472656, 208.9271697998047)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'jossa teksti “djur-pantomim”, tyhjiä / epäonnistuneita', 'origin': (96.15774536132812, 217.1892852783203), 'bbox': (96.15774536132812, 207.3589324951172, 478.73663330078125, 220.73513793945312)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'kuvia lattialla, sakset, paperia, Beundrarmus =', 'origin': (96.15774536132812, 228.9972381591797), 'bbox': (96.15774536132812, 219.16688537597656, 429.1433410644531, 232.5430908203125)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'tavallinen oranssi hiiri).', 'origin': (96.15774536132812, 240.80519104003906), 'bbox': (96.15774536132812, 230.97483825683594, 280.36309814453125, 244.35104370117188)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'LOTUS', 'origin': (252.01351928710938, 267.3730773925781), 'bbox': (252.01351928710938, 257.542724609375, 287.4385681152344, 270.9189147949219)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'De va den sista bilden! Kasta burken', 'origin': (202.42933654785156, 286.5610046386719), 'bbox': (202.42933654785156, 276.73065185546875, 457.4823303222656, 290.1068420410156)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'till Tika!', 'origin': (202.42933654785156, 298.36895751953125), 'bbox': (202.42933654785156, 288.5386047363281, 273.27825927734375, 301.914794921875)}, {'size': 11.807954788208008, 'flags': 12, 'font': 'CourierNewPSMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': 'De kastar ner en burk i ett rör.', 'origin': (96.15774536132812, 317.556884765625), 'bbox': (96.15774536132812, 307.7265319824219, 322.87176513671875, 321.10272216796875)}, {'size': 11.807954788208008, 'flags': 28, 'font': 'CourierNewPS-BoldMT', 'color': 3355443, 'ascender': 0.83251953125, 'descender': -0.30029296875, 'text': '12104', 'origin': (51.87791061401367, 354.4567565917969), 'bbox': (51.87791061401367, 344.62640380859375, 84.35554504394531, 358.0025939941406)}]}


testfile_scene_ids = ["SCRIPT DETAILS","12102 INT. LOTUS RUM", "12104 INT. LOTUS RUM", "12109 INT. LOTUS RUM", "12111 INT. LOTUS RUM", "12118 INT. LOTUS RUM", "12116 INT. LOTUS RUM","13711 INT. KÄLLAREN", "12203 INT. LABBRÅTTORNAS LABB", "12805 INT. LABBRÅTTORNAS LABB",
                    "12809 INT. LABBRÅTTORNAS LABB", "13205 INT. VIKINGMUSVÅNINGEN", "13312 INT. VIKINGAMUSVÅNINGEN", "13510 INT. VIKINGMUSVÅNINGEN", "14404 INT. KONTROLLRUMMET",
                    "14414 INT. KONTROLLRUMMET", "14418 INT. KONTROLLRUMMET", "14421 INT. KONTROLLRUMMET" ,"14503 INT. KONTROLLRUMMET"]

testfile = "testfile.pdf"
folder_path = os.path.abspath("uploaded_files")

'''
Tests
'''

def test_reader_reads_non_existing_file():
    invalid_filename = "doesntexist.pdf"
    reader = ReaderV3() 
    with pytest.raises(FileNotFoundError,  match=rf"No such file: './uploaded_files/{invalid_filename}'"):
        reader.read_file("doesntexist.pdf")
    
    assert reader.filename == None
    

def test_reader_reads_file(reader_with_testfile):
    assert reader_with_testfile.filename == "testfile.pdf"

def test_reader_to_json_output_has_correct_attributes(reader_with_testfile):
    result = reader_with_testfile.to_json()
    assert result["script_id"]
    assert result["filename"]
    assert result["scenes"]
   

def test_testfile_has_correct_number_of_scenes(testfile_scenes):
    assert len(testfile_scenes) == len(testfile_scenes)
   
def test_reader_has_identified_scenes_correctly(testfile_scenes):
    for scene in testfile_scenes:
        assert scene["id"] in testfile_scene_ids
        
def test_reader_scene_data_is_a_list(testfile_scenes):
    for scene in testfile_scenes:
        assert isinstance(scene["data"], list) 

def test_reader_to_json_scenes_data_attribute_has_list_of_objects(testfile_scenes) -> None:
    for scene in testfile_scenes:
        for line in scene["data"]:
            assert isinstance(line, object) 


''' 
   id: (If line_id = True) -> str
   type: -> str
   name: -> str
   lines: (default) -> list
'''
def test_reader_to_json_data_objects_contain_required_attributes(reader_with_testfile, testfile_scenes) -> None:
    for scene in testfile_scenes:
        for line in scene["data"]:
            assert line["type"]
            assert isinstance(line["lines"], list)
            assert isinstance(line["name"], str)

def test_reader_to_json_data_objects_dont_contain_id_attribute_by_default() -> None:
    for scene in reader_to_json()["scenes"]:
        for line in scene["data"]:
            assert not hasattr(line, "id")

def test_reader_to_json_data_objects_contain_id_attribute_if_specified() -> None:
    reader = ReaderV3(line_id=True)
    reader.read_file(testfile)
    result = reader.to_json()
    for scene in result["scenes"]:
        for line in scene["data"]: 
            assert line["id"]
          
def test_reader_to_json_data_objects_return_lines_as_string_if_specified() -> None:
    reader = ReaderV3(line_id=True, lines_as_string=True)
    reader.read_file(testfile)
    result = reader.to_json()
    for scene in result["scenes"]:
        for line in scene["data"]: 
            assert isinstance(line["lines"], str)
          

'''
With Settings
'''

def test_reader_to_json_with_settings_outputs_correct_number_of_scenes() -> None:
    
    reader = ReaderV3( line_id=True, lines_as_string=True)
    reader.read_file(testfile)
    result = reader.to_json()
 
    assert len(result["scenes"]) == len(testfile_scene_ids)


'''
New script tests
'''
filenames = [
             {"filename": "1.9.pdf", "number_of_scenes": 12},
             {"filename": "4.9.pdf", "number_of_scenes": 36},
             {"filename": "5.9.pdf", "number_of_scenes": 29},
             {"filename": "6.9.pdf", "number_of_scenes": 27},
             {"filename": "7.9.pdf", "number_of_scenes": 7},
             {"filename": "12.9.pdf", "number_of_scenes": 7},
             {"filename": "15.9.pdf", "number_of_scenes": 17},
             {"filename": "18.9.pdf", "number_of_scenes": 16},
             {"filename": "19.9.pdf", "number_of_scenes": 19},
             {"filename": "20.9.pdf", "number_of_scenes": 12},
             {"filename": "21.9.pdf", "number_of_scenes": 20},
             {"filename": "25.9.pdf", "number_of_scenes": 20},
             {"filename": "29.8.pdf", "number_of_scenes": 27},
             {"filename": "30.8.pdf", "number_of_scenes": 6},
             {"filename": "31.8.pdf", "number_of_scenes": 13},
             {"filename": "1508_BUU_SCRIPT.pdf", "number_of_scenes": 8},
             {"filename": "1608_BUU_SCRIPT.pdf", "number_of_scenes": 5},
             #{"filename": "test2.pdf", "number_of_scenes": 16},

            ]
  
def test_scene_detection():
    reader = ReaderV3( line_id=True, lines_as_string=True)
    for file in filenames:
        reader.read_file(file["filename"])
        scenes = reader.make_scenes(reader.file)
        assert len(scenes) == file["number_of_scenes"]

'''
Test make_scenes_new functions 
'''
def test_group_lines():
    reader = ReaderV3()
    reader.read_file("1.9.pdf")
   
    list_of_scenes = reader.make_scenes_new()
    for scene_dict in list_of_scenes:
        for key in scene_dict:
            print(key)
    assert len(list_of_scenes) == 12
    


'''
helper functions
'''
def reader_to_json():
    reader = ReaderV3()
    reader.read_file(testfile)
    return reader.to_json()

