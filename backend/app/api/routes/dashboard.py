from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

from app.models.user import User
from app.models.entry import Entry
from app.models.skill import Skill

router = APIRouter()

@router.get("/")
async def get_dashboard_stats():
    # Fetch a default user for testing purposes
    current_user = await User.find_one()
    if not current_user:
        return {
            "total_entries": 0,
            "total_skills": 0,
            "current_streak": 0,
            "recent_entries": [],
            "top_skills": [],
            "skills_needing_review": []
        }
    
    # Total Entries
    total_entries = await Entry.find(Entry.user.id == current_user.id).count()
    
    # Total Skills
    total_skills = await Skill.find(Skill.user.id == current_user.id).count()
    
    # Recent Entries (top 3)
    recent_entries: List[Entry] = await Entry.find(Entry.user.id == current_user.id).sort(-Entry.created_at).limit(3).to_list()
    # Explicitly fetch linked skills
    for entry in recent_entries:
        if entry.extracted_skills:
            fetched = []
            for skill_link in entry.extracted_skills:
                fetched_skill = await skill_link.fetch()
                fetched.append(fetched_skill)
            entry.extracted_skills = fetched
    
    # Top Skills (top 3 by occurrences)
    top_skills: List[Skill] = await Skill.find(Skill.user.id == current_user.id).sort(-Skill.occurrences).limit(3).to_list()
    
    # Skills Needing Review (degradation < 80)
    skills_needing_review: List[Skill] = await Skill.find(Skill.user.id == current_user.id, Skill.degradation_level < 80).limit(2).to_list()
    
    # If no skills need review naturally yet, pick one randomly or just return empty
    # Just to ensure the UI shows something for the mock
    if len(skills_needing_review) == 0 and total_skills > 0:
        a_skill = await Skill.find_one(Skill.user.id == current_user.id)
        if a_skill:
            a_skill.degradation_level = 65
            skills_needing_review = [a_skill]

    return {
        "total_entries": total_entries,
        "total_skills": total_skills,
        "current_streak": 5, # Mock streak
        "recent_entries": [{
            "id": str(e.id),
            "content": e.content,
            "created_at": e.created_at,
            "skills": [s.name for s in e.extracted_skills] if e.extracted_skills else []
        } for e in recent_entries],
        "top_skills": [{
            "id": str(s.id),
            "name": s.name,
            "occurrences": s.occurrences
        } for s in top_skills],
        "skills_needing_review": [{
            "id": str(s.id),
            "name": s.name,
            "description": s.description,
            "degradation_level": s.degradation_level
        } for s in skills_needing_review]
    }
