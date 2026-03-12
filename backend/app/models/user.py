from typing import Optional
from datetime import datetime
from beanie import Document
from pydantic import EmailStr, Field

class User(Document):
    email: EmailStr
    name: Optional[str] = None
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
