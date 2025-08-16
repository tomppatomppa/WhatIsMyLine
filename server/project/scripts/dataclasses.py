from dataclasses import dataclass
from typing import Optional

@dataclass
class ScriptUpdateDTO:
    id: int
    markdown: Optional[str] = None
    filename: Optional[str] = None