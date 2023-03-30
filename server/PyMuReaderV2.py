import fitz
from bs4 import BeautifulSoup
import re

class ReaderV2():
    def __init__(self):   
       self.pages = []     
       self.html = []

    def read_file(self, filename): 
        try:
            pdf_doc = fitz.open(f'./testfiles/{filename}')         
            for page in pdf_doc:  
                self.pages.append(page.get_text("dict", sort=False))
                for line in page.get_text("html").splitlines():    
                    if not "font-size:8.0pt" in line and not "left:512.4pt" in line:
                        self.html.append(line)
                
        except FileNotFoundError:
            print("File not found")

    def get_html(self):
        return self.html
    
    def to_html(self):
        
        combined_soup = self.make_soup()
        combined_soup = self.into_sections(combined_soup)
        combined_soup = self.remove_tags(combined_soup, "tt")
        
        combined_soup = self.into_lines(combined_soup)
       
        return combined_soup
    
    def make_soup(self):
        combined_soup = BeautifulSoup("", "html.parser")
        for doc in self.html:
            combined_soup.append(BeautifulSoup(doc, "html.parser"))
        return combined_soup
    
    def remove_tags(self, html, tag):
        soup = BeautifulSoup(html, 'html.parser')
        for p in soup.find_all(tag):
            p.unwrap()
        return soup.prettify()
       
    def into_lines(self, soup):
        actor_id = 'left:252.0pt'
        lines_id = 'left:202.4pt;'
        soup = BeautifulSoup(soup, 'html.parser')
        actor_tags = soup.find_all('p', style=lambda value: value and actor_id in value)
    
        for actor_tag in actor_tags:
            ul_tag = soup.new_tag('ul')
            ul_tag["style"] = actor_tag["style"]
            ul_tag["id"] = actor_tag.get_text().strip()
            sibling_tag = actor_tag.find_next_sibling()

            while sibling_tag and sibling_tag.has_attr("style") and lines_id in sibling_tag['style']:
                li_tag = soup.new_tag('li')
                span_tag = sibling_tag.find('span')
                li_tag["style"] = span_tag["style"]
                li_tag.string = sibling_tag.text     
                ul_tag.append(li_tag)     
                decompose_this = sibling_tag
                sibling_tag = sibling_tag.find_next_sibling()
                decompose_this.decompose()        

            actor_tag.insert_after(ul_tag)
            actor_tag.decompose() ## Actor id is <ul id="NAME" />
    
        return soup.prettify()
    
    def into_sections(self, soup):
        #soup = BeautifulSoup(html, features="lxml")
        new_soup = BeautifulSoup("<div></div>", "html.parser")
        # Keep track of the current section
        current_section = new_soup.new_tag("section")
    
        previous = "" 
        # Loop through all paragraphs in the original HTML
        for p in soup.find_all("p"):
        
            # Get the text of the current paragraph
            text = p.get_text().strip()
            
            # Check if the current paragraph matches the start of a new section
            if re.match(r"^\d+$", previous ) and re.match(r"[A-Z\dÄÅÖ.]+ [A-Z\dÄÅÖ]+", text):
                section_title = previous+" " +text
                if current_section:
                    current_section.append(p.extract())
                    new_soup.div.append(current_section)
                # p.name = 'p'
                p.tt.b.span.string = section_title
                p.name = 'h1'
                current_section = new_soup.new_tag("section")
                current_section.append(p.extract()) 
            else:
                current_section.append(p.extract())    
            previous = text
        #add remaining
        new_soup.append(current_section)
        return new_soup.prettify()
  


