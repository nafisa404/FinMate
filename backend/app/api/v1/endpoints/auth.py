from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.auth import authenticate_user, create_access_token, get_current_user, get_password_hash
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import Token, LoginRequest, RegisterRequest, User as UserSchema

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint"""
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=Token)
async def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """Register new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == register_data.email) | (User.username == register_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(register_data.password)
    db_user = User(
        email=register_data.email,
        username=register_data.username,
        hashed_password=hashed_password,
        full_name=register_data.full_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.post("/refresh")
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token"""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    """Logout endpoint (client should discard token)"""
    return {"message": "Successfully logged out"} 