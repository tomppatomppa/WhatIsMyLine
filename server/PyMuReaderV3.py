import fitz
import re

MIN_PAGE_WIDTH=100.0

class ReaderV3():
    def __init__(self):
       self.filename = None
       self.page_width = None
       self.file = None

    def read_file(self, filename):
        try:
            self.filename = filename
            pdf_doc = fitz.open(f'./uploaded_files/{filename}')
            pages = []
            for page in pdf_doc:
                pages.append(page.get_text("dict", sort=False))
            
            return self.flatten_all(pages)

        except FileNotFoundError:
            print("File not found")
    
    def set_page_width(self, width):
        if not float(width):
           raise ValueError(f"Invalid page width value {width}")
        elif float(width) < MIN_PAGE_WIDTH:
            raise ValueError(f"Minimum page width {MIN_PAGE_WIDTH}")
        self.page_width = float(width)
       

    def flatten_all(self, pages):
        merged_dict = {
            'width': pages[0]['width'],
            'height': pages[0]['height'],
            'blocks': [block for d in pages for block in d['blocks']]
        }
        self.set_page_width(merged_dict["width"])

        lines = [line for block in merged_dict["blocks"] for line in block["lines"]]
        merged_dict["blocks"] = [span for line in lines for span in line["spans"]]
        self.file = merged_dict

    def to_json(self):
        with_scenes = self.make_scenes(self.file)
        with_lines = self.make_lines(with_scenes)
        return with_lines

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
                scene_title = " ".join([ previous_line["text"], current_line["text"]])
                current_scene = {scene_title: []}
            else:
                current_scene[scene_title].append(current_line)
            previous_line = current_line
        scenes.append(current_scene)

        return scenes

    def is_scene(self, current_line, previous_line):
        if not previous_line:
            return False
        if(current_line["text"]).isdigit():
            return False
        if self.is_actor(current_line["origin"][0],current_line["text"]):
            return False
        #Quick fix to handle /
        text = current_line["text"].replace("/", "")
        section_pattern = r'^(?!.*\b[A-Z\dÄÅÖ]+\s\d)[A-Z\dÄÅÖ.-]+(?: [A-Z\dÄÅÖ-]+)*$'
       
        return re.match(r"^\d+$", previous_line["text"]) and re.match(section_pattern, text)

    def make_lines(self, file):
       
        result = {"filename": self.filename, "scenes": []}
        for scene in file:
            for scene_name, lines in scene.items():
                scene_data = {"id": scene_name, "data": []}
                actor_lines = []
                info_lines = []
                for line in lines:
                    text = line["text"]
                    if self.is_actor(line["origin"][0], text):
                        if actor_lines:
                            scene_data["data"].append({"type": "ACTOR", "name":
                                                            actor_lines[0], "lines": actor_lines[1:]})
                            actor_lines = []
                        if info_lines:
                           scene_data["data"].append({"type": "INFO" ,"lines": info_lines})
                           info_lines = []
                        actor_lines.append(text)
                    elif self.is_line(line) and actor_lines:
                        actor_lines.append(text)                 
                    else:
                        info_lines.append(text)
                if actor_lines:
                    scene_data["data"].append({"type": "ACTOR", "name":
                                                    actor_lines[0], "lines": actor_lines[1:]})
                if info_lines:
                    scene_data["data"].append({"type": "INFO" ,"lines": info_lines})
                result["scenes"].append(scene_data)
        
        return result      

    def is_line(self, line):
        originX = line["origin"][0]

        if originX > 188 and originX < 220:
            #print(f"{text} is flagged as a line", styles)
            return True
        else:
            #print(f"{line.text} is NOT a line")
            return False

    def is_actor(self, value, name):
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

if __name__ == '__main__':
    reader= ReaderV3()
    reader.read_file("filename")
    print(reader.to_json())

