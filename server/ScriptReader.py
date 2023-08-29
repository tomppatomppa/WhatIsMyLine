import fitz
import os
import pandas as pd

class ScriptReader():
    def __init__(self):
       self.file = None
       self.filename = None

    def read_file(self, filename):
        file_path = f"./uploaded_files/{filename}"

        if not os.path.exists(file_path):
         raise FileNotFoundError(f"No such file: '{file_path}'")
        
        self.filename = filename
        pdf_doc = fitz.open(f'./uploaded_files/{filename}')
        pages = [page.get_text("dict", sort=True) for page in pdf_doc]

        self.file = self.flatten_all(pages)   

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
    

    def add_page_index(self, df):
        '''
        If the y axis is less than the previous y axis,
        it indicates a new page in the parsed document.
        Adds a new column "page" to the DataFrame
        to index the pages.
        '''
        filtered_df = df[df['y'] < df['y'].shift(1)]
        df['page'] = df.index.isin(filtered_df.index).cumsum()
        return df
    
    def sort_subsections(self, df):
        '''
        Sorts x column in ascending order grouped by columns ["page", "y"]
        returns new data frame with index reset
        Fitz module returns sometimes the x axis in wrong order even when sort=True.
        page_doc.get_text("dict", sort=True)
        '''
        df = df.groupby(['page','y'], group_keys=False, sort=False).apply(pd.DataFrame.sort_values, 'x')
        return  df.reset_index(drop=True)
    
    def prepare_data(self):
        df = pd.DataFrame(self.file["blocks"])
        columns_to_drop = ["color", "ascender", "descender", "flags", "font", "bbox", "origin"]

        #Split origin(tuple) into x and y columns
        df[['x', 'y']] = df['origin'].apply(lambda x: pd.Series(x))

        df = df.drop(columns_to_drop, axis=1, errors="ignore")
        df = self.add_page_index(df)
       
        df = self.sort_subsections(df) 
        print(df)
        print(df.loc[0:42, ["text", "x", "y"]])