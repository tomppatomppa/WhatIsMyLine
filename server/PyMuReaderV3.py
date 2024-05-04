from functools import partial, reduce
from itertools import islice
import os
import fitz
import re
from uuid import uuid4


MIN_PAGE_WIDTH = 100.0


def match_regex(string):
        filtered_array = [string for string in string.split(" ") if string != ""]
        regex_array = [r"^\d+$", r"^(?!^\d+$)[A-ZÄÅÖ0-9]+$", r"^(?!^\d+$)[A-ZÄÅÖ0-9]+$"]
        for index, string in islice(enumerate(filtered_array, 0), 3):
                if not re.match(regex_array[index], string):
                    return False  
        return True

def combine_dicts(acc, current, scenes, default_key):
    if not acc:
        acc.append({default_key: []})
    elif current["text"] in scenes:
        acc.append({current["text"]: []})
    else:
        last_dict = acc[-1]
        key = next(iter(last_dict))
        last_dict[key].append(current)
    return acc



class ReaderV3():
    def __init__(self,  line_id = False, lines_as_string = False):
       
       self.filename = None
       self.file = None
       self.line_id = line_id
       self.lines_as_string = lines_as_string
       self.min_font_size = 9.41166877746582
       self.lines_max_start_x_axis = 400
       self.page_width = None

    def read_file(self, filename):
        file_path = f"./uploaded_files/{filename}"

        if not os.path.exists(file_path):
         raise FileNotFoundError(f"No such file: '{file_path}'")
        
        self.filename = filename
        pdf_doc = fitz.open(f'./uploaded_files/{filename}')
        pages = [page.get_text("dict", sort=False) for page in pdf_doc]
      
        self.set_page_width(pages[0]['width'])
        self.file = self.flatten_all(pages)
           
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
    
    def make_scenes_new(self):
        '''
        string_mutations:
            modifications on string before applying scene_conditions

        scene_conditions lambda parameters:
            modified_string: string from string_mutations
            line: original string

        '''
        string_mutations = [
            #Remove special characters
            partial(re.sub, r"[^a-zA-Z0-9\sÄÖÅäöå]", ""),
            #removes the consecutive duplicate numbers from string
            partial(re.sub, r'(\b\d+\b)\s+\1', r'\1'),
        ]

        scene_conditions = [
            lambda modified_string, line: match_regex(modified_string),
            lambda modified_string, line: line["origin"][0] <= self.page_width / 2,  
        ]

        scenes = []
        lines = self.group_lines(axis = 1)
        for line in lines:
            if self.detect_scene(line, string_mutations, scene_conditions):
                scenes.append(line["text"])
              
        combined = partial(combine_dicts, scenes=scenes, default_key="SCRIPT DETAILS")
        result_list = reduce(combined, lines, [])
        
        return result_list
    
    def detect_scene(self, line, mutations, conditions):
        modified_string = line["text"]
        for mutation in mutations:
            modified_string = mutation(modified_string)
        
        is_valid = all(cond(modified_string, line) for cond in conditions)

        return is_valid
       

    def is_scene(self, current_line, previous_line):
        '''
        Hardcoded scene detection
        Scene is assumed to begin with an INT followed by UPPERCASE LETTERS
        If the current line is detected as an actor return False
        #TODO: Flag as scene if they exists on the same line

        '''
        if previous_line is None:
            return False  
            

        #if text is not on the same line (x axis)
        if(current_line["origin"][1] != previous_line["origin"][1]):
            return False
        
        if(current_line["text"]).isdigit():
            return False
        #temp fix to handle page numbers flagged as scene start
        if(previous_line["origin"][0] > self.page_width / 2):
            return False
        #Quick fix to handle /
        text = current_line["text"].replace("/", "")
        split_text = text.split(" ")
        if len(split_text) < 2:
            return False
        section_pattern = r'^(?!.*\b[A-Z\dÄÅÖ]+\s\d)[A-Z\dÄÅÖ.-]+(?: [A-Z\dÄÅÖ-]+)*$'
       
        return re.match(r"^\d+$", previous_line["text"]) and re.match(section_pattern, " ".join(split_text[:2]))

    def clean_lines(self, file):
        cleaned_file = []
        for scene in file:
            for name, lines in scene.items():
                filtered_items = [item for item in lines if item['size'] >= self.min_font_size]                                  
                filtered_items = [item for item in filtered_items if item['origin'][0] <= self.lines_max_start_x_axis]         
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

        # Base case: all scenes processed
        if(scene_index >= len(scenes)):
            return { "filename": self.filename,"scenes": result }
        
        scene_id = list(scenes[scene_index].keys())[0]     
        current_lines = scenes[scene_index][scene_id]

        # Get the next line from the current scene          
        line = current_lines.pop(0)

        #If no lines left in scene, append current scene to result array and move to the next scene
        if not current_lines:
            currentScene[-1]["lines"].append(line["text"])
            result.append({"id": scene_id, "data": currentScene})
            return self.make_lines_recursive(scenes, current_lines, scene_index + 1, None, result)
        
        line_type = self.get_line_type(line)
        name = line["text"] if line_type == "ACTOR" else ""
        text = [line["text"]] if name == "" else []

        if currentScene:    
            previous_type = currentScene[-1]["type"]

            # Check if the line type allows grouping with previous lines
            if(line_type == "LINE" or (line_type == "INFO" and line_type == previous_type)):    
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
    

    def group_lines(self, axis):
        '''
        axis = 1 = y-axis
        axis = 0 = x-axis
        Groups lines based on ["origin"][axis]
        '''
        grouped_lines = []
        
        for current_line in self.file["blocks"]:
            if grouped_lines and current_line["origin"][axis] == grouped_lines[-1]["origin"][axis]:
                combined_text = " ".join([grouped_lines[-1]["text"], current_line["text"]])
                grouped_lines[-1]["text"] = combined_text
            else:
                grouped_lines.append(current_line)
        
        return grouped_lines
    
 
    def to_json(self):
        '''
        Converts text content to a script item with the following structure   
        {
           script_id: string
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
        result = self.clean_lines(result)
        result = self.make_lines_recursive(result)
       
        if(self.line_id):
            result = self.add_uuid(result)
        if(self.lines_as_string):
            result = self.lines_into_string(result)
     
        result["script_id"] = result["filename"].replace(".pdf", "")
        
        return result
    
    
