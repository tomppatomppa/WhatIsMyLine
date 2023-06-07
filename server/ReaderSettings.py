from dataclasses import dataclass

from typing import Union

@dataclass
class Line:
    """Class for representing line return type"""
    type: Union[list, str]
    def get_type(self) -> Union[list, str]:
        return self.type

class ReaderSettings:
    def __init__(self, type = ""):
        self.line_return_type = Line(type=type)

    def get_settings(self):
        return self.line_return_type