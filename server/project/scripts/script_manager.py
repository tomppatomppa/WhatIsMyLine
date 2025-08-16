import re
import uuid
import pymupdf4llm
import markdown

class ScriptManager:
    
    def __init__(self):
        self.parser = pymupdf4llm
        self.markdown = None
    def to_markdown(self, doc, remove_backticks=False):
        md_text = self.parser.to_markdown(doc, table_strategy=None, page_chunks=False)
        if remove_backticks:
            return self.remove_backticks(md_text)
        return self.process_pdf_markdown(md_text)
    
    def remove_backticks(self, md_text):
        text = re.sub(r"```", '', md_text)
        return re.sub(r"´´´", '', text)
    def process_pdf_markdown(self, raw_markdown):
        """
        Complete processing for PDF-extracted markdown with script content
        """
        # Remove garbage prefix
        processed = re.sub(r'^[a-z\s]{1,10}\n', '', raw_markdown, flags=re.MULTILINE)
        
        # Remove empty code blocks first
        processed = self.remove_empty_code_blocks(processed)
        
        # Clean backticks
        processed = self.clean_script_markdown(processed)
        
        # Final cleanup
        processed = re.sub(r'\n{3,}', '\n\n', processed)

        processed = self.fix_code_blocks(processed)
        return processed.strip()

    def clean_markdown_backticks(self, markdown_text):
        """
        Remove all ``` from markdown except the first and last.
        If first or last don't exist, add them.
        """
        if not markdown_text:
            return markdown_text
        
        # Find all ``` occurrences with their positions
        backtick_pattern = r'^```.*?$'
        matches = list(re.finditer(backtick_pattern, markdown_text, re.MULTILINE))
        
        if not matches:
            # No backticks found, wrap entire content in code block
            return f'```txt\n{markdown_text.strip()}\n```'
        
        if len(matches) == 1:
            # Only one backtick found
            first_match = matches[0]
            content_after_first = markdown_text[first_match.end():].strip()
            
            # Add closing backticks
            return markdown_text[:first_match.end()] + '\n' + content_after_first + '\n```'
        
        if len(matches) == 2:
            # Perfect - already has opening and closing
            return markdown_text
        
        # More than 2 backticks - remove middle ones
        first_match = matches[0]
        last_match = matches[-1]
        
        # Get content between first and last, removing any ``` in between
        middle_content = markdown_text[first_match.end():last_match.start()]
        
        # Remove all ``` lines from middle content
        middle_content = re.sub(r'^```.*?$\n?', '', middle_content, flags=re.MULTILINE)
        
        # Reconstruct the markdown
        result = (
            markdown_text[:first_match.end()] +  # Everything up to and including first ```
            middle_content +                      # Cleaned middle content
            markdown_text[last_match.start():]   # Last ``` and everything after
        )
        
        return result

    def clean_script_markdown(self, markdown_text):
        """
        Specialized version for script content with additional cleaning
        """
        if not markdown_text:
            return markdown_text
        
        # First, extract header information (title, date, etc.)
        lines = markdown_text.split('\n')
        header_lines = []
        content_start_index = 0
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith('#') or stripped.startswith('Date:'):
                header_lines.append(stripped)
            elif stripped and not stripped.startswith('```'):
                # Found first non-header content
                content_start_index = i
                break
            elif stripped.startswith('```'):
                content_start_index = i
                break
        
        # Get the content part (everything from first ``` or content)
        content_part = '\n'.join(lines[content_start_index:])
        
        # Clean the content part
        cleaned_content = self.clean_markdown_backticks(content_part)
        
        # Ensure the code block has a language identifier
        if cleaned_content.startswith('```\n'):
            cleaned_content = '```txt\n' + cleaned_content[4:]
        elif cleaned_content.startswith('```') and not re.match(r'```\w+', cleaned_content):
            cleaned_content = cleaned_content.replace('```', '```txt\n', 1)
        
        # Combine header with cleaned content
        if header_lines:
            result = '\n'.join(header_lines) + '\n\n' + cleaned_content
        else:
            result = cleaned_content
        
        return result

    def remove_empty_code_blocks(self, markdown_text):
        """
        Remove empty or nearly empty code blocks (just scene numbers, etc.)
        """
        # Pattern to match code blocks with only whitespace, numbers, or very short content
        empty_block_pattern = r'```[^\n]*\n\s*(?:\d+\s*)?\n```'
        
        # Remove empty blocks
        cleaned = re.sub(empty_block_pattern, '', markdown_text, flags=re.MULTILINE)
        
        # Clean up excessive newlines
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        
        return cleaned.strip()

    def fix_code_blocks(self, md_text: str) -> str:
        lines = md_text.split('\n')
        fixed_lines = []
        inside_code_block = False
        opening_indices = []

        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith('```'):
                if not inside_code_block:
                    # Opening code block found
                    inside_code_block = True
                    opening_indices.append(i)
                    # Add txt after ```
                    if stripped == '```':
                        line = line.replace('```', '```txt', 1)
                    elif stripped.startswith('```') and not stripped.startswith('```txt'):
                        # Replace opening ```something with ```txt (or append txt)
                        # To keep consistent, replace any after ``` with txt
                        line = '```txt' + line[len('```'):].lstrip('`')
                else:
                    # Closing code block found
                    inside_code_block = False
            fixed_lines.append(line)

        # After scanning, if inside_code_block is still True, missing closing ```
        if inside_code_block:
            fixed_lines.append('```')  # Add missing closing ticks at the end

        return '\n'.join(fixed_lines)
    
    def parse_markdown_to_json(self, md_text):
        # Convert Markdown to HTML
        html = markdown.markdown(md_text, extensions=['extra'])

        # Split HTML into lines for easier processing
        lines = html.splitlines()
        result = []
        current_scene = None
        current_actor = None
        current_lines = []
        scene_id = None

        # Regular expressions for parsing
        scene_pattern = re.compile(r'^<h1>(.*?)</h1>$')
        actor_pattern = re.compile(r'^<h2>(.*?)</h2>$')
        ext_pattern = re.compile(r'^<h3>(.*?)</h3>$')
        int_pattern = re.compile(r'^<h4>(.*?)</h4>$')
        p_pattern = re.compile(r'^<p>(.*?)</p>$')

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check for scene (h1)
            scene_match = scene_pattern.match(line)
            if scene_match:
                if current_scene:
                    # Save previous scene if exists
                    result.append(current_scene)
                scene_id = self.clean_text(scene_match.group(1).strip())
                current_scene = {
                    "id": scene_id,
                    "data": []
                }
                current_actor = None
                current_lines = []
                continue

            # Check for actor (h2)
            actor_match = actor_pattern.match(line)
            if actor_match:
                if current_actor and current_lines:
                    # Save previous actor's data with line breaks
                    current_scene["data"].append({
                        "type": "ACTOR",
                        "name": self.clean_text(current_actor),
                        "lines": "\n".join(self.clean_text(line) for line in current_lines if line),
                        "id": str(uuid.uuid4())
                    })
                    current_lines = []
                current_actor = self.clean_text(actor_match.group(1).strip())
                continue

            # Check for EXT (h3)
            ext_match = ext_pattern.match(line)
            if ext_match:
                if current_actor and current_lines:
                    # Save previous actor's data with line breaks
                    current_scene["data"].append({
                        "type": "ACTOR",
                        "name": self.clean_text(current_actor),
                        "lines": "\n".join(self.clean_text(line) for line in current_lines if line),
                        "id": str(uuid.uuid4())
                    })
                    current_actor = None
                    current_lines = []
                current_scene["data"].append({
                    "type": "EXT",
                    "name": "",
                    "lines": self.clean_text(ext_match.group(1).strip()),
                    "id": str(uuid.uuid4())
                })
                continue

            # Check for INT (h4)
            int_match = int_pattern.match(line)
            if int_match:
                if current_actor and current_lines:
                    # Save previous actor's data with line breaks
                    current_scene["data"].append({
                        "type": "ACTOR",
                        "name": self.clean_text(current_actor),
                        "lines": "\n".join(self.clean_text(line) for line in current_lines if line),
                        "id": str(uuid.uuid4())
                    })
                    current_actor = None
                    current_lines = []
                current_scene["data"].append({
                    "type": "INT",
                    "name": "",
                    "lines": self.clean_text(int_match.group(1).strip()),
                    "id": str(uuid.uuid4())
                })
                continue

            # Check for paragraph (p) or other text
            p_match = p_pattern.match(line)
            if p_match:
                content = p_match.group(1).strip()
                if content.startswith('*') and content.endswith('*'):
                    # This is an INFO block
                    if current_actor and current_lines:
                        # Save previous actor's data with line breaks
                        current_scene["data"].append({
                            "type": "ACTOR",
                            "name": self.clean_text(current_actor),
                            "lines": "\n".join(self.clean_text(line) for line in current_lines if line),
                            "id": str(uuid.uuid4())
                        })
                        current_actor = None
                        current_lines = []
                    current_scene["data"].append({
                        "type": "INFO",
                        "name": "",
                        "lines": self.clean_text(content[1:-1]),  # Remove asterisks
                        "id": str(uuid.uuid4())
                    })
                else:
                    # This is actor dialogue
                    if current_actor:
                        current_lines.append(content)
                continue

            # Handle plain text (non-<p> wrapped content)
            if current_actor and line:
                current_lines.append(line.strip())

        # Save the last actor/scene if they exist
        if current_actor and current_lines:
            current_scene["data"].append({
                "type": "ACTOR",
                "name": self.clean_text(current_actor),
                "lines": "\n".join(self.clean_text(line) for line in current_lines if line),
                "id": str(uuid.uuid4())
            })
        if current_scene:
            result.append(current_scene)

        return result

    def clean_text(self, text):
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Remove &#x20; (HTML space entity)
        text = text.replace('&#x20;', '')
        # Remove multiple spaces and normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
