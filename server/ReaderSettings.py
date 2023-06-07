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
        self.min_font_size = 10
        self.lines_max_start_x_axis = 400 # 400px

    def __str__(self) -> str:
        return f'line_return_type'
    def get_line_return_type(self):
        return self.line_return_type
       
    def get_min_font_size(self):
        return self.min_font_size
    
    def get_lines_max_start_x_axis(self):
        return self.lines_max_start_x_axis
  