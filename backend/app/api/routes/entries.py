import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.models.user import User
from app.models.entry import Entry
from app.models.skill import Skill
from app.api.deps import get_current_user
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

router = APIRouter()

class EntryCreate(BaseModel):
    content: str

class EntryResponse(BaseModel):
    id: str
    content: str
    extracted_skills_count: int

@router.post("/", response_model=EntryResponse)
async def create_entry(
    entry_in: EntryCreate,
):
    # Fetch a default user for testing purposes, or create one if none exists
    logger.debug("Fetching default user for entry creation.")
    current_user = await User.find_one()
    if not current_user:
        logger.info("Creating default test user.")
        current_user = User(email="test@test.com", full_name="Test User", hashed_password="mock")
        await current_user.insert()
        
    # 1. Save the new entry
    logger.info("Inserting new entry into MongoDB.")
    new_entry = Entry(
        user=current_user,
        content=entry_in.content
    )
    await new_entry.insert()
    logger.debug(f"Entry {new_entry.id} inserted.")
    
    # 2. Extract Skills (Mock AI Call)
    logger.info("Initiating skill extraction.")
    extracted_data = await ai_service.extract_skills(entry_in.content)
    
    # 3. Process extracted skills
    skill_links = []
    for skill_info in extracted_data:
        # Check if skill exists for this user
        logger.debug(f"Checking if skill '{skill_info['name']}' exists for user {current_user.id}")
        existing_skill = await Skill.find_one(
            Skill.user.id == current_user.id,
            Skill.name == skill_info["name"]
        )
        
        if existing_skill:
            # Update existing skill
            logger.info(f"Updating existing skill: {existing_skill.name}")
            existing_skill.occurrences += 1
            existing_skill.degradation_level = 100 # Reset degradation
            await existing_skill.save()
            skill_links.append(existing_skill)
        else:
            # Create new skill
            logger.info(f"Creating new skill: {skill_info['name']}")
            new_skill = Skill(
                user=current_user,
                name=skill_info["name"],
                description=skill_info["description"]
            )
            await new_skill.insert()
            skill_links.append(new_skill)
            
    # 4. Attach skills to the entry
    logger.info(f"Attaching {len(skill_links)} skills to entry {new_entry.id}")
    new_entry.extracted_skills = skill_links
    await new_entry.save()
    
    return {
        "id": str(new_entry.id),
        "content": new_entry.content,
        "extracted_skills_count": len(skill_links)
    }

@router.get("/")
async def get_entries(
    skip: int = 0,
    limit: int = 20,
):
    current_user = await User.find_one()
    if not current_user:
        return []
        
    entries = await Entry.find(Entry.user.id == current_user.id).skip(skip).limit(limit).to_list()
    return [{
        "id": str(e.id),
        "content": e.content,
        "created_at": e.created_at
    } for e in entries]
