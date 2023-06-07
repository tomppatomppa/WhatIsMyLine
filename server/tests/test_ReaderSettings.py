
from ReaderSettings import ReaderSettings, Line

import pytest

def test_default_line_return_type_is_str() -> None:
    settings = ReaderSettings()
    assert isinstance(settings.line_return_type.type, str)

def test_setting_line_return_type_should_be_list() -> None:
    settings = ReaderSettings([])
    assert isinstance(settings.line_return_type.type, list)
    
