from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from .user import User

class Skill(Document):
    user: Link[User]
    name: str
    description: str
    occurrences: int = 1
    degradation_level: int = 100
    last_mentioned_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "skills"
