from PyMuReaderV3 import ReaderV3
import os

folder_path = './uploaded_files'
testfile = "testfile.pdf"

def test_uploaded_files_folder_exists() -> None:
 
    assert os.path.exists(folder_path)

def test_testfile_exists() -> None:
 
    assert os.path.exists(f"{folder_path}/{testfile}")

def test_reader_reads_file() -> None:
    reader = ReaderV3()
    reader.read_file(testfile)
    assert reader.filename == testfile

