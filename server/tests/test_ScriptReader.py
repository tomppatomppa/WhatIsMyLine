'''
ScriptReader using pandas

TODO: Finish
'''

def test_scriptreader_has_file(script_reader_with_file):
    assert script_reader_with_file.file 

def test_scriptreader_prepare_data(script_reader_with_file):
    assert script_reader_with_file.prepare_data() 