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

    def read_file(self, filename): 
        try:
            self.filename = filename
            pdf_doc = fitz.open(f'./testfiles/2023.pdf')
            
            arr = []     
            for page in pdf_doc:
                arr.append(page.get_text("dict", sort=False))
                if len(arr) < 2:
                    print(page.get_text("dict", sort=False))
                
            
        except FileNotFoundError:
            print("File not found")
   

if __name__ == '__main__':
    reader= ReaderV3()
    reader.read_file("filename")
