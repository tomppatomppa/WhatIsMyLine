from PyMuReaderV3 import ReaderV3
import pytest

def test_set_page_width_zero_throws_error() -> None:
    reader = ReaderV3()
    with pytest.raises(ValueError,  match=r"Invalid page width value 0"):
        reader.set_page_width(0)
  
    assert reader.page_width == None

def test_set_page_width_converts_int_to_float() -> None:
    reader = ReaderV3()
    reader.set_page_width(240)
    
    assert isinstance(reader.page_width, float)
   
def test_set_page_width_as_non_digit_string_throws_error() -> None:
    reader = ReaderV3()
    
    with pytest.raises(ValueError, match=r"could not convert string to float: 'asString"):
        reader.set_page_width("asString")
    
    assert reader.page_width == None

def test_set_page_width_convertsStrToFloat() -> None:
    reader = ReaderV3()
    reader.set_page_width("523.00")
    
    assert reader.page_width == 523.00
   
def test_set_page_width_minimum_page_width() -> None:
    reader = ReaderV3()
    with pytest.raises(ValueError, match=r"Minimum page width 100.0"):
        reader.set_page_width(99)
    