import fitz
from bs4 import BeautifulSoup
import re

class ReaderV2():
    def __init__(self): 
       self.filename = None  
       self.pages = []     
       self.html = []
       self.names = {}
       self.page_width = None

    def read_file(self, filename): 
        try:
            self.filename = filename
            pdf_doc = fitz.open(f'{filename}')         
            for page in pdf_doc:
                page_content = page.get_text("dict", sort=False)
                self.page_width = page_content["width"]
                self.pages.append(page_content)
                #TODO: fix validation
                for line in page.get_text("html").splitlines():    
                    if not "font-size:8.0pt" in line and not "left:512.4pt" in line:
                        self.html.append(line)         
        except FileNotFoundError:
            print("File not found")
           

    def get_html(self):
        return self.html
    
    def to_html(self):  
        soup = self.make_soup()
        combined_soup = self.into_sections(soup)
        combined_soup = self.remove_tags(combined_soup, "tt")  
        combined_soup = self.into_lines(combined_soup)
       
        return combined_soup
    
    def make_soup(self):
        combined_soup = BeautifulSoup("", "html.parser")
        combined_soup["id"] = "test"
        for doc in self.html:
            combined_soup.append(BeautifulSoup(doc, "html.parser"))
        return combined_soup
    
    def remove_tags(self, html, tag):
        soup = BeautifulSoup(html, 'html.parser')
        for p in soup.find_all(tag):
            p.unwrap()
        return soup.prettify()
       
    def into_lines(self, soup):
        """
        Identifies what tags belong to an actor

        Adds the lines that belong to that actor in a single </ul> element
            <ul id="NAME">
              <li> ... </li>
              <li> ... </li>
              ...etc
            </ul>
        
        """

        soup = BeautifulSoup(soup, 'html.parser')   
        actor_tags = self.get_actor_tags(soup)
       
        for actor_tag in actor_tags:
            ul_tag = soup.new_tag('ul')
            ul_tag["style"] = actor_tag["style"]    
            #id is used on client side to identify actor name
            ul_tag["id"] = actor_tag.get_text().strip()
            sibling_tag = actor_tag.find_next_sibling()
            while sibling_tag and sibling_tag.has_attr("style") and self.is_line(sibling_tag):
                li_tag = soup.new_tag('li')
                span_tag = sibling_tag.find('span')
                li_tag["style"] = span_tag["style"]
                li_tag.string = sibling_tag.text     
                ul_tag.append(li_tag)     
                decompose_this = sibling_tag
                sibling_tag = sibling_tag.find_next_sibling()
                decompose_this.decompose()        
            
            actor_tag.insert_after(ul_tag)
            #remove tag containing actor name, name was already added to </ul id="NAME">
            actor_tag.decompose()
       
        return soup.prettify()
    
   
    def into_sections(self, soup):
        """
        Parses given soup to section elements.

        Sections are identified by an r"^\d+$", and r"[A-Z\dÄÅÖ.]+ [A-Z\dÄÅÖ]+" pattern

        examples: text "13804" followed by text "EXT. KLÖSUS KONTOR"
          gets flagged as a scene start.
        Adds conequent lines into that section until an new scene gets detected,
          or no more <p> tags to validate

        example output:    <section id="13804 EXT. KLÖSUS KONTOR">
                              <p>...</p>
                           </section>
                           <section id="..."
                              <p>...</p>...
                           </section>
        
        This of course assumes the original pdf document has this pattern

        TODO: detect scene start if INT and PATTERN on the same line
        
        """
        new_soup = BeautifulSoup("<div></div>", "html.parser")
        new_soup.div["id"] = self.filename

        current_section = new_soup.new_tag("section")

        previous_text = "" 
        for p in soup.find_all("p"):
            current_text = p.get_text().strip()
            if self.is_section_start(previous_text, current_text):
                section_title = " ".join([previous_text, current_text])
                #print("IS SECTION START", section_title)
                if current_section:
                    current_section.append(p.extract())
                    new_soup.div.append(current_section)
                p.span.string = section_title
                p.name = 'h1'
                current_section = new_soup.new_tag("section")
                current_section["id"] = section_title
                current_section.append(p.extract()) 
            else:
                current_section.append(p.extract())    
            previous_text = current_text
            
        
        new_soup.append(current_section)
        
        return new_soup.prettify()
    
    def get_actor_tags(self, soup):
        """
        returns an array containing all suspected actor tags
        """
        actor_tags = soup.find_all('p')
        actors = []
        for tag in actor_tags:
            styles = tag.get('style').split(";")
            name = tag.get_text().strip()
            if self.is_actor(styles, name):
                if tag is not None:
                    actors.append(tag)
       
        return actors
    

    def is_line(self, line):
        styles = line.get('style').split(";")

        value = None
        for style in styles:
            if style.startswith('left:'):
                value_str = ''.join(filter(lambda x: x.isdigit() or x == '.', style)) 
                value = float(value_str)
        if value > 188 and value < 220:
            #print(f"{text} is flagged as a line", styles)
            return True
        else:
            #print(f"{line.text} is NOT a line")
            return False
       
    


    def is_actor(self, styles, name):
        """
        Tries to identifify actor names

        Ideally a script should have elements in a predictable place for easy readability.
        This function assumes all actor are written in UPPERCASE, and starts in the middle(ish) of the docment,
        Names can be followed by additional information like NAME (O.S),
          which is an abbreviation for "Off Screen" etc..

        The the function allows 20% margin to left and right

        styles parameter should look like ['top:241.0pt', 'left:202.4pt', 'line-height:11.8pt']
        """
        name_pattern = r'^[A-Z0-9ÖÄÅ]+\s?(\([^)]*\))?$'
        alt_name_pattern = r'^[A-Z0-9ÖÄÅ]+\s?\(?(\d+|[A-Z]+|\([^)]*\))?\)?$'
        value = None
        
        for style in styles:
            if style.startswith('left:'):
                value_str = ''.join(filter(lambda x: x.isdigit() or x == '.', style)) 
                value = float(value_str)

        center = self.page_width / 2
        margin = self.page_width * 0.2 / 2
        left_limit = center - margin
        right_limit = center + margin

        if left_limit <= value <= right_limit and re.match(alt_name_pattern, name):
            #print(f"{name} is flagged as valid name")
            self.names[name] = value
            return True
        else:
            #print(f"{name} is NOT a name")
            return False
    

    def is_section_start(self, previous_text, current_text):
        if(current_text.isdigit()):
            return False
        section_pattern = r'^(?!.*\b[A-Z\dÄÅÖ]+\s\d)[A-Z\dÄÅÖ.-]+(?: [A-Z\dÄÅÖ-]+)*$'
        return re.match(r"^\d+$", previous_text) and re.match(section_pattern, current_text)
           
