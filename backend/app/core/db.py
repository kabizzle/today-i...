from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .config import settings
from app.models.user import User
from app.models.entry import Entry
from app.models.skill import Skill

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, Entry, Skill]
    )
