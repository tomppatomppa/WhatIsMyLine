import fitz
from bs4 import BeautifulSoup
import re
import numpy as np
class ReaderV3():
    def __init__(self): 
       self.filename = None  
       self.pages = []     
       self.html = []
       self.page_width = None
       self.file = None

    def read_file(self, filename): 
        try:
            self.filename = filename
            pdf_doc = fitz.open(f'./testfiles/4.4.pdf')
            
            pages = []     
            for page in pdf_doc:
                pages.append(page.get_text("dict", sort=False)) 
            return self.concat_all_lines(pages)
                         
        except FileNotFoundError:
            print("File not found")
     
    def concat_all_lines(self, pages):
        merged_dict = {
            'width': pages[0]['width'],
            'height': pages[0]['height'],
            'blocks': [block for d in pages for block in d['blocks']]
        }
        self.page_width = merged_dict["width"]
        lines = [line for block in merged_dict["blocks"] for line in block["lines"]]
        merged_dict["blocks"] = [span for line in lines for span in line["spans"]]
        self.file = merged_dict
       

    def to_json(self):
      
        with_scenes = self.make_scenes(self.file)
        with_lines = self.make_lines(with_scenes)
        

    def make_scenes(self, file):
        scenes = []
        scene_title = "SCRIPT DETAILS"
        current_scene = {scene_title: []}
        previous_line = None
        
        for current_line in file["blocks"]:
            if self.is_scene(current_line, previous_line):
                if current_scene:
                   scenes.append(current_scene)
                   current_scene = None
                scene_title = " ".join([current_line["text"], previous_line["text"]])
                current_scene = {scene_title: []}
            else:
                current_scene[scene_title].append(current_line)
            previous_line = current_line
        return scenes

    def is_scene(self, current_line, previous_line):
        if not previous_line:
            return False
        if(current_line["text"]).isdigit():
            return False
        section_pattern = r'^(?!.*\b[A-Z\dÄÅÖ]+\s\d)[A-Z\dÄÅÖ.-]+(?: [A-Z\dÄÅÖ-]+)*$'
        return re.match(r"^\d+$", previous_line["text"]) and re.match(section_pattern, current_line["text"])
    
    def make_lines(self, file):
        scene_details = file[0]

        for scene in file[1:]:
            for lines in scene.values():
                for line in lines:
                    self.is_actor(line["origin"][0], line["text"])
                    
               
                

    def is_actor(self, value, name):
        name_pattern = r'^[A-Z0-9ÖÄÅ]+\s?\(?(\d+|[A-ZÖÄÅ]+|\([^)]*\))?\)?$'
        center = self.page_width / 2
        margin = self.page_width * 0.2 / 2
        left_limit = center - margin
        right_limit = center + margin
       
        if left_limit <= value <= right_limit and re.match(name_pattern, name):
            print(f"{name} is flagged as valid name")
            
            return True
        else:
            #print(f"{name} is NOT a name")
            return False
if __name__ == '__main__':
    reader= ReaderV3()
    reader.read_file("filename")
    reader.to_json()

