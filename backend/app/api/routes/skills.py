from typing import List
from fastapi import APIRouter, Depends
from app.models.user import User
from app.models.skill import Skill
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/")
async def get_skills():
    """Get all skills for the current user."""
    current_user = await User.find_one()
    if not current_user:
        return []
        
    skills = await Skill.find(Skill.user.id == current_user.id).sort(-Skill.occurrences).to_list()
    return [{
        "id": str(s.id),
        "name": s.name,
        "description": s.description,
        "occurrences": s.occurrences,
        "degradation_level": s.degradation_level,
        "last_mentioned_at": s.last_mentioned_at
    } for s in skills]

@router.get("/needs-review")
async def get_degrading_skills(
    current_user: User = Depends(get_current_user)
):
    """Mock endpoint to return skills that need a Feynman assessment."""
    # In a real app we'd query by degradation_level < threshold
    skills = await Skill.find(
        Skill.user.id == current_user.id,
        Skill.degradation_level < 80
    ).to_list()
    
    return [{
        "id": str(s.id),
        "name": s.name,
        "degradation_level": s.degradation_level
    } for s in skills]
