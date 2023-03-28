import fitz
import re 
import json

class Reader():
    def __init__(self):
       self.filename = None
       self.title = None
       self.scene_pattern = r"^\d+\s-"
       self.actor_pattern = r'^[A-Z0-9ÖÄÅ]+\s?(\([^)]*\))?$'
       self.pages = []
       self.scenes = []
    def read_file(self, filename): 
        self.filename = filename
        try:
            pdf_doc = fitz.open(f'{filename}')         
            for page in pdf_doc:  
                self.pages.append(page.get_text("dict", sort=False))
            return "read file"
        except FileNotFoundError:
            print("File not found")
    def line_type(self, span):
        #watermark from when printing from dramatify 
        if(span["size"] <= 8):
            return "PRINT_DETAILS"
        elif(span["origin"][0] > 300): #page numbers                            
            return "RIGHT"
        elif(span["origin"][0] > 244 or re.match(self.actor_pattern, span["text"])):
            return "ACTOR" 
        elif(span["origin"][0] > 108):
            return "LINE"                                 
        else:                        
            return "INFO"
    

    def parse_pages(self):  
        current_scene = []
        scenes = []
        
        for page in self.pages:
            for block in page["blocks"]:              
                for line in block["lines"]:
                    span = line["spans"][0]
                    if re.match(self.scene_pattern, span["text"]):                                                                                    
                        if current_scene:                           
                            scenes.append(current_scene)                                                  
                            current_scene = []
                        current_scene.append({"ID": span["text"]})                        
                    elif current_scene:                        
                        if(self.line_type(span) in current_scene[-1].keys()):             
                            current_scene[-1][self.line_type(span)].append(span["text"])                            
                        else:
                            current_scene.append({self.line_type(span): [span["text"]]})
                    elif(span["size"] >= 18.0 and self.title is None):
                        self.title = span["text"]
                    
                      
        if current_scene:
            scenes.append(current_scene)         
       
         
        return scenes               

    def parse_header(self, header):
        parts = header.split("-")
        if("." in parts[1]):
           location, place = parts[1].split(".", 1)
           return  {"id": parts[0].strip(), "location": location.strip(), "place": place.strip()}      
        return {"id": parts[0].strip(), "location": parts[1], "place": None} 
    
    def to_json(self):
        if(self.filename is None):
            return json.dumps({"error": "No file"})
        document = []
        scenes = self.parse_pages()
        for scene in scenes:
            document.append(self.parse_scene(scene))
        
        json_document = json.dumps({"filename": self.filename,"title": self.title, "scenes": document})
        return json_document
     
    def parse_scene(self, dialogue):
        current_actor = None
        current_lines = []

        scenes = []
        
        for item in dialogue:           
            if 'ID' in item:               
                scene_id = item['ID']         
            elif 'ACTOR' in item:
                # If a new actor is encountered, create a new scene object for the previous actor's lines
                if current_actor is not None:
                    scenes.append({'type': 'ACTOR',"name": current_actor, 'line': current_lines})
                # Set the current actor to the value of the ACTOR key
                current_actor = item['ACTOR'][0]
                current_lines = []
            elif 'LINE' in item:
                current_lines += item['LINE']
            elif 'INFO' in item:
                scenes.append({'type': 'INFO', 'line': item['INFO']})
          
        # Add a scene object for the last actor's lines
        if(current_lines):
            scenes.append({'type': 'ACTOR',"name": current_actor, 'line': current_lines})    
        dialogue_object = {**self.parse_header(scene_id), 'lines': scenes}

        return dialogue_object
# if __name__ == '__main__':

#     reader = Reader()
#     print(reader.read_file("default.pdf"))
#     print(reader.to_json())