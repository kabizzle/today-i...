from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from app.core import security
from app.core.config import settings
from app.models.user import User

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str = None

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate):
    user = await User.find_one(User.email == user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    new_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        name=user_in.name,
    )
    await new_user.insert()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            new_user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login", response_model=Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me")
async def read_users_me():
    # Since auth is bypassed for now, return the default test user
    user = await User.find_one()
    if not user:
        return {"email": "user@example.com", "name": "Guest User", "joined": "Today"}
    return {
        "email": user.email,
        "name": user.name or "User",
        "joined": user.created_at.strftime("%B %d, %Y")
    }
