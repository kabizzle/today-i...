from typing import List, Optional
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from .user import User
from .skill import Skill

class Entry(Document):
    user: Link[User]
    content: str
    extracted_skills: List[Link[Skill]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "entries"
