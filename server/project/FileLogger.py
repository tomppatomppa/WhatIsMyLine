import json
import os
from datetime import datetime
import re

class FileLogger:
    def __init__(self, base_directory="logs", route="default"):
        self.base_directory = base_directory
        self.route = route
        
        log_directory = os.path.join(self.base_directory, *self.route.split('/'))  # Create subdirectories based on the route
        os.makedirs(log_directory, exist_ok=True)  # Ensure that the directory exists
        
        self.file_path = os.path.join(log_directory, f"{self.route.split('/')[-1]}.log")
        # Ensure the log file exists
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                f.write("")

    def _write_log(self, level, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level.upper()}] [{message}]\n"
        with open(self.file_path, "a") as log_file:
            log_file.write(log_entry)

    def info(self, message):
        """Log an informational message."""
        self._write_log("info", message)

    def error(self, message):
        """Log an error message."""
        self._write_log("error", message)

    def warning(self, message):
        """Log a warning message."""
        self._write_log("warning", message)

    def debug(self, message):
        """Log a debug message."""
        self._write_log("debug", message)

    def critical(self, message):
        """Log a critical message."""
        self._write_log("critical", message)
    
    def get_log_data(self):
        """Read and parse the log file into a list of dictionaries"""
        log_entries = []
        try:
            with open(self.file_path, 'r') as f:
                lines = f.readlines()
                for line in lines:
                    parts = line.strip().split("] [")
                    if len(parts) == 3:
                        timestamp, level, message = parts
                        timestamp = timestamp.strip('[')
                        level = level.strip()
                        log_entries.append({"timestamp": timestamp, "level": level, "message": message})
        except FileNotFoundError:
            pass
        return log_entries
    
    def get_all_log_files_data(self):
       """Fetch data from all .log files in the base directory"""
       all_log_entries = []
    
       
       for root, dirs, files in os.walk(self.base_directory):
            for file in files:
               if file.endswith(".log"):
                   log_file_path = os.path.join(root, file)
                   # Read the file's log data
                   with open(log_file_path, 'r') as log_file:
                       lines = log_file.readlines()
                     
                       for line in lines:
                           parts = line.strip().split("] [")
                           print(parts, len(parts))
                           if len(parts) == 3:
                               timestamp, level, message = parts
                               timestamp = timestamp.strip('[')
                               level = level.strip()
                               all_log_entries.append({"timestamp": timestamp, "level": level, "message": message})
       return all_log_entries

    def get_log_files_data_from_folder(self, folder_name):
       """Fetch data from all .log files in a specific folder"""
       folder_path = os.path.join(self.base_directory, folder_name)
       all_log_entries = []
       
       if os.path.exists(folder_path):
           for file in os.listdir(folder_path):
               if file.endswith(".log"):
                   log_file_path = os.path.join(folder_path, file)
                   # Read the file's log data
                   with open(log_file_path, 'r') as log_file:
                       lines = log_file.readlines()
                       for line in lines:
                           parts = line.strip().split("] [")
                           if len(parts) == 3:
                               timestamp, level, message = parts
                               timestamp = timestamp.strip('[')
                               level = level.strip()
                               all_log_entries.append({"timestamp": timestamp, "level": level, "message": message})
       return all_log_entries
   
    def _parse_log_entry(self, line):
        """Parse log entry and extract structured data"""
        # Define the pattern to capture timestamp, log level, and message
        pattern = r"\[(.*?)\] \[(.*?)\] (.*?)(?: IP: (.*?), User-Agent: (.*?), Payload: (.*))?"
        match = re.match(pattern, line.strip())

        if match:
            timestamp = match.group(1)
            level = match.group(2)
            message = match.group(3)
            ip = match.group(4) if match.group(4) else None
            user_agent = match.group(5) if match.group(5) else None
            payload = match.group(6) if match.group(6) else None

            # Optionally, convert the payload string to a Python dictionary if it's a valid JSON string
            if payload:
                try:
                    payload = json.loads(payload)
                except json.JSONDecodeError:
                    payload = {}

            return {
                "timestamp": timestamp,
                "level": level,
                "message": message,
                "ip": ip,
                "user_agent": user_agent,
                "payload": payload
            }
        return None