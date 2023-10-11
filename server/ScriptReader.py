from itertools import islice
import re
import fitz
import os
import pandas as pd

#TODO: Try to get a working version
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
        '''
        page_break = df[df['y'] < df['y'].shift(1)]
        df['page'] = df.index.isin(page_break.index).cumsum() + 1
       
        return df
    
    def sort_subsections(self, df):
        '''
        Sorts x column in ascending order grouped by columns ["page", "y"]
        returns new data frame with index reset
        Fitz module returns sometimes the x axis in wrong order even when sort=True.
        page_doc.get_text("dict", sort=True)
        '''
        df = df.groupby(['page','y'], group_keys=False, sort=False).apply(pd.DataFrame.sort_values, 'x')
        return df.reset_index(drop=True)

    def remove_max_x_and_y(self, df):
        '''
        Clean out max/min y and x values
        '''
        x_max = df["x"].max()
        x_min = df["x"].min()
        y_max = df["y"].max()
        y_min = df["y"].min()
          
        x_max_and_min_filter = (df["x"] != x_max) & (df["x"] != x_min)
        y_max_and_min_filter = (df["y"] != y_max) & (df["y"] != y_min)

        filtered_df = df[x_max_and_min_filter & y_max_and_min_filter]
      
        return filtered_df.reset_index(drop=True)
    
    def concat_consecutive_rows(self, df):
        '''
        Concat text from consecutive rows with the same "y" value
        Removes duplicate rows, except the first 
        '''
        consecutive_rows = df['y'] == df['y'].shift(-1)
        df.loc[consecutive_rows, 'text'] = df['text'] + ' ' + df['text'].shift(-1)
        df = df[~df.duplicated(subset='y', keep="first")]
     
        return df
    
    def detect_scenes(self, string):
        special_char_removed = re.sub(r"[^a-zA-Z0-9\sÄÖÅäöå]", "", string)
        filtered_array = [string for string in special_char_removed.split(" ") if string != ""]

        if len(filtered_array) == 1:
            return False
        
        regex_array = [r"^\d+$", r"^(?!^\d+$)[A-ZÄÅÖ0-9]+$", r"^(?!^\d+$)[A-ZÄÅÖ0-9]+$"]

        for index, string in islice(enumerate(filtered_array, 0), 3):
            if not re.match(regex_array[index], string):
                return False  
        return True
    
    def add_index_to_scene(self, df):
        '''
        The column scene which marks an individual scene starting from index 1
        '''
    
        scene_number = 1
        scene_column = []
      
        for group in df.groupby(["scene"]):
            scene_column.extend([scene_number] * len(group))
            scene_number += 1
    
        df.reset_index(drop=True, inplace=True)

        scene_break = df[df['scene']]
        df['scene_number'] = df.index.isin(scene_break.index).cumsum() + 1

        return df
    

    '''
    Detect Actors
    '''
    def detect_actor(self, row, x_column_stats):
        score = 0
        if row["scene"]:
            return False
        if row["x"] > x_column_stats["75%"]:
            score += 0.3
        if row["text"].isupper():
            score += 0.3
        if score > 0.5:
            return True
        return False
    
    def detect_line_group(self , group, mean_value):
        original, upper_bound, lower_bound = number_with_variation(mean_value, 20)
        # Check if all rows in the group satisfy the condition
        group.loc[(group["x"] >= lower_bound) & (group["x"] <= upper_bound), "line"] = True
        
        return group
    
    def prepare_data(self):
        df = pd.DataFrame(self.file["blocks"])
        columns_to_drop = ["color", "ascender", "descender", "flags", "font", "bbox", "origin"]

        #Split origin(tuple) into x and y columns
        df[['x', 'y']] = df['origin'].apply(lambda x: pd.Series(x))

        df = df.drop(columns_to_drop, axis=1, errors="ignore")
        df = self.add_page_index(df)

        df = self.sort_subsections(df) 

        #TODO: Might need adjustment
        df = self.remove_max_x_and_y(df)
        df = self.remove_max_x_and_y(df)

        df = self.concat_consecutive_rows(df)
        df["scene"] = df["text"].apply(self.detect_scenes)
    
        df = self.add_index_to_scene(df)

        x_column_stats = df.describe()["x"]
        df["actor"] = df.apply(lambda x: self.detect_actor(x, x_column_stats), axis=1)

        actor_x_mean = df[df["actor"] == True]["x"].mean()
        filtered_rows = df[(df["actor"] != True) & (df["scene"] != True)]
        result = filtered_rows.groupby("scene_number", group_keys=False).apply(lambda x: self.detect_line_group(x, actor_x_mean))
        df = df.merge(result[['line']], left_index=True, right_index=True, how='left')
        df['line'].fillna(False, inplace=True)

        print(df.loc[0:42, ["text",  "scene_number", "line"]])
        return True
      
        
        
       

def number_with_variation(input_number, percentage_variation):
    # Calculate the positive and negative variations based on the percentage
    positive_variation = input_number * (1 + percentage_variation / 100)
    negative_variation = input_number * (1 - percentage_variation / 100)

    # Return the tuple containing the original number and variations
    return (input_number, positive_variation, negative_variation)