from PyMuReaderV3 import ReaderV3
import os


testfile = "testfile.pdf"
folder_path = os.path.abspath("uploaded_files")

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


