import fitz
import re
from ReaderSettings import ReaderSettings
import json
from uuid import uuid4
MIN_PAGE_WIDTH=100.0

class ReaderV3():
    def __init__(self, settings = None, line_id = False, lines_as_string = False):
       self.settings = settings
       self.filename = None
       self.page_width = None
       self.file = None
       self.line_id = line_id
       self.lines_as_string = lines_as_string

    def read_file(self, filename):
        try:
            self.filename = filename
            pdf_doc = fitz.open(f'./uploaded_files/{filename}')
            pages = []
            for page in pdf_doc:
                pages.append(page.get_text("dict", sort=False))
            
            self.set_page_width(pages[0]['width'])
            self.file = self.flatten_all(pages)

        except FileNotFoundError:
            print("File not found")
    
    def set_page_width(self, width):
        if not float(width):
           raise ValueError(f"Invalid page width value {width}")
        elif float(width) < MIN_PAGE_WIDTH:
            raise ValueError(f"Minimum page width {MIN_PAGE_WIDTH}")
        self.page_width = float(width)      

    def flatten_all(self, pages):
        '''
        This function flattens all the pages and their text content into one list called "blocks"

        For more info on the json structure created by PyMuPdf
          visit https://pymupdf.readthedocs.io/en/latest/app1.html#dict-or-json
        '''
        #flatten all pages
        blocks = [block for page in pages for block in page['blocks']]
        #flatten all lines
        lines = [line for block in blocks for line in block["lines"]]

        merged_dict = {
            'width': pages[0]['width'],
            'height': pages[0]['height'],
            # flatten all spans
            'blocks': [span for line in lines for span in line["spans"]]
        }
        return merged_dict
        
    def make_scenes(self, file):
        '''
        Tries to divide file into different scenes if they exists

        appends consequent lines into current scene until a new scene is detected

        returned file structure should look something like
          [{"SCENE DETAILS: [...]}, {"00001 SCENE WITH SOMETHING: [...]}]

        '''
        scenes = []
        scene_title = "SCRIPT DETAILS"
        current_scene = {scene_title: []}
        previous_line = None

        for current_line in file["blocks"]:
            if self.is_scene(current_line, previous_line):
                if current_scene:
                   scenes.append(current_scene)
                   current_scene = None
                scene_title = " ".join([previous_line["text"], current_line["text"]])
                current_scene = {scene_title: []}
            else:
                current_scene[scene_title].append(current_line)
            previous_line = current_line
        scenes.append(current_scene)
        
        return scenes

    def is_scene(self, current_line, previous_line):
        '''
        Hardcoded scene detection
        
        Scene is assumed to begin with an INT followed by UPPERCASE LETTERS

        If the current line is detected as an actor return False

        #TODO: Flag as scene if they exists on the same line

        '''
        if not previous_line:
            return False
        if(current_line["text"]).isdigit():
            return False
        if self.is_actor(current_line["origin"][0], current_line["text"]):
            return False
        #temp fix to handle page numbers flagged as scene start
        if(previous_line["origin"][0] > self.page_width / 2):
            return False
        #Quick fix to handle /
        text = current_line["text"].replace("/", "")
        section_pattern = r'^(?!.*\b[A-Z\dÄÅÖ]+\s\d)[A-Z\dÄÅÖ.-]+(?: [A-Z\dÄÅÖ-]+)*$'
       
        return re.match(r"^\d+$", previous_line["text"]) and re.match(section_pattern, text)

    def clean_lines(self, file):
        cleaned_file = []
        for scene in file:
            for name, lines in scene.items():        
                filtered_items = [item for item in lines if item['size'] >= self.settings.get_min_font_size()]                                  
                filtered_items = [item for item in filtered_items if item['origin'][0] <= self.settings.get_lines_max_start_x_axis()]         
                cleaned_file.append({name: filtered_items})
        return cleaned_file
    
    def get_line_type(self, line):
        if self.is_actor(line["origin"][0], line["text"]):
            return "ACTOR"
        if self.is_line(line):
            return "LINE"
        return "INFO"
    
    def make_lines_recursive(self, scenes, current_lines = None, scene_index = 0, currentScene = None, result = None):
        if not result:
            result = []
            
        if(scene_index >= len(scenes)):
            return { "filename": self.filename,"scenes": result }
        
        scene_id = list(scenes[scene_index].keys())[0]     
        current_lines = scenes[scene_index][scene_id]             
        line = current_lines.pop(0)
        #Add to result array go to next scene
        if not current_lines:
            currentScene[-1]["lines"].append(line["text"])
            result.append({"id": scene_id, "data": currentScene})
            return self.make_lines_recursive(scenes, current_lines, scene_index + 1, None, result)
        
        line_type = self.get_line_type(line)
        name = line["text"] if line_type == "ACTOR" else ""
        text = [line["text"]] if name == "" else []

        if currentScene:
            previous_type = currentScene[-1]["type"]
            if(line_type == "LINE" or "INFO" and line_type == previous_type):          
                currentScene[-1]["lines"].append(line["text"])
            else:
                currentScene.append({"type": line_type, "name": name, "lines": text})   
        else: 
            currentScene = [{"type": line_type, "name": name, "lines": [line["text"]]}]
        
        return self.make_lines_recursive(scenes, current_lines, scene_index, currentScene, result)
 
    def is_line(self, line):
        originX = line["origin"][0]

        if originX > 188 and originX < 220:
            #print(f"{text} is flagged as a line", styles)
            return True
        else:
            #print(f"{line.text} is NOT a line")
            return False

    def is_actor(self, value, name):
        '''
        Actors NAMES are expected to be UPPERCASE and positioned in the middle of the document
            with an margin of 20% to left and right

        '''
        name_pattern = r'^[A-Z0-9ÖÄÅ]+\s?\(?(\d+|[A-ZÖÄÅ]+|\([^)]*\))?\)?$'
        center = self.page_width / 2
        margin = self.page_width * 0.2 / 2
        left_limit = center - margin
        right_limit = center + margin

        if left_limit <= value <= right_limit and re.match(name_pattern, name):
            #print(f"{name} is flagged as valid name")
            return True
        else:
            #print(f"{name} is NOT a name")
            return False

    def add_uuid(self, script):
        for scene in script["scenes"]:
            for line in scene["data"]:
                line["id"] = str(uuid4())
        return script
    
    def lines_into_string(self, script):
        for scene in script["scenes"]:
           for line in scene["data"]:
               line["lines"] = "\n".join(line["lines"])
        return script
      
    def to_json(self):
        '''
        Converts text content to a script item with the following structure   
        {
           filename: string
           scenes: [
             {
               id: string
               data: [{ type: string, name: string, lines: [string]}, ...]           
             },
           ]
        }

        '''
        result = self.make_scenes(self.file)

        if(self.settings):
            result = self.clean_lines(result)
        
        result = self.make_lines_recursive(result)
       
        if(self.line_id):
            result = self.add_uuid(result)
        if(self.lines_as_string):
            result = self.lines_into_string(result)

        return result
    
    
#if __name__ == '__main__':
    # settings = ReaderSettings()
   
    # reader = ReaderV3(settings, line_id=True, lines_as_string=True)
    # reader.read_file("testfile.pdf")
    # result = reader.to_json()

    # print(len(result["scenes"]))
   
    # print(json.dumps(result, indent=4))

