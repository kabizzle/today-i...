import json
import os
import logging
from typing import List, Dict
from google import genai
from pydantic import BaseModel
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize the client. We assume GEMINI_API_KEY is available in the environment or settings.
# google-genai will automatically pick up GEMINI_API_KEY from os.environ, 
# so we can explicitly set it if settings.GEMINI_API_KEY is provided and not in env.
if settings.GEMINI_API_KEY and not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY

class SkillInfo(BaseModel):
    name: str
    description: str

class AIService:
    def __init__(self):
        # We only initialize the client if we have a key, otherwise we fallback to mock
        self.client = None
        if os.environ.get("GEMINI_API_KEY"):
            self.client = genai.Client()

    async def extract_skills(self, content: str) -> List[Dict[str, str]]:
        """
        Uses Gemini to extract skills and reasoning from the content.
        Falls back to mock implementation if no API key is provided.
        """
        if not self.client:
            logger.warning("No GEMINI_API_KEY found. Falling back to simple heuristic for AI service.")
            return self._mock_extract(content)

        prompt = f"""
Analyze the following text from a digital diary entry and extract the professional skills or technologies the user demonstrated or learned.
For each skill, provide a brief description of how it was applied or what it entails based on the context.

Entry text:
"{content}"

Return ONLY a JSON array of objects with the keys "name" and "description". Do not wrap in markdown blocks, just return the raw JSON array.
"""
        logger.info(f"Sending request to Gemini API. Content length: {len(content)}")
        logger.debug(f"Gemini Prompt: {prompt}")

        try:
            # We use gemini-2.5-flash as the default fast model
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                )
            )
            
            response_text = response.text.strip()
            logger.info("Received successful response from Gemini API.")
            logger.debug(f"Gemini Raw Response: {response_text}")
            
            # Clean up potential markdown formatting
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
                
            skills_data = json.loads(response_text)
            
            # Ensure proper formatting
            validated_skills = []
            for item in skills_data:
                if "name" in item and "description" in item:
                    validated_skills.append({
                        "name": str(item["name"]),
                        "description": str(item["description"])
                    })
                    
            logger.info(f"Successfully extracted {len(validated_skills)} skills via Gemini.")
            return validated_skills
            
        except Exception as e:
            logger.error(f"Error calling Gemini AI: {e}", exc_info=True)
            # Fallback on error
            return self._mock_extract(content)

    def _mock_extract(self, content: str) -> List[Dict[str, str]]:
        content_lower = content.lower()
        skills = []
        
        if "react" in content_lower or "frontend" in content_lower:
            skills.append({
                "name": "React Frontend Development",
                "description": "Building user interfaces using React and modern web technologies."
            })
            
        if "python" in content_lower or "backend" in content_lower or "fastapi" in content_lower:
            skills.append({
                "name": "Python API Development",
                "description": "Designing and building robust backend services using Python."
            })
            
        if "database" in content_lower or "mongodb" in content_lower or "sql" in content_lower:
            skills.append({
                "name": "Database Management",
                "description": "Designing schemas and managing data persistence operations."
            })
            
        if "debug" in content_lower or "error" in content_lower or "fix" in content_lower:
            skills.append({
                "name": "Debugging and Troubleshooting",
                "description": "Identifying and resolving complex software issues."
            })
            
        if not skills:
            skills.append({
                "name": "Software Engineering Fundamentals",
                "description": "General application of software engineering principles."
            })
            
        return skills

ai_service = AIService()
