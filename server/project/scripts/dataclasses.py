from dataclasses import dataclass
from typing import Optional

@dataclass
class ScriptUpdateDTO:
    id: int
    script_id: Optional[str] = None #uploaded file pdf
    markdown: Optional[str] = None
    filename: Optional[str] = None