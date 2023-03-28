import fitz

class Reader():
    def __init__(self):
       
       self.title = None
       self.scene_pattern = r"^\d+\s-"
       self.actor_pattern = r'^[A-Z0-9ÖÄÅ]+\s?(\([^)]*\))?$'
       self.pages = []
       self.scenes = []
    def read_file(self, filename): 
        self.title = None
        try:
            pdf_doc = fitz.open(f'./testfiles/{filename}')         
            for page in pdf_doc:  
                self.pages.append(page.get_text("dict", sort=False))
            return "read file"
        except FileNotFoundError:
            print("File not found")

# if __name__ == '__main__':

#     reader = Reader()
#     print(reader.read_file("default.pdf"))