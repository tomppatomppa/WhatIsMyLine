from PyMuReaderV3 import ReaderV3
import pytest

def test_set_page_width_int() -> None:
    reader = ReaderV3()
    with pytest.raises(ValueError,  match=r"Invalid page width value 0"):
        reader.set_page_width(0)
  
    assert reader.page_width == None
   

def test_set_page_width_string() -> None:
    reader = ReaderV3()
    
    with pytest.raises(ValueError, match=r"could not convert string to float: 'asString"):
        reader.set_page_width("asString")
    
    assert reader.page_width == None
   
    