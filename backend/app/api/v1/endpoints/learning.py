from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.learning import Course, UserCourseProgress, Achievement, UserAchievement

router = APIRouter()

@router.get("/courses", response_model=List[dict])
async def get_courses(
    level: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get available courses"""
    query = db.query(Course).filter(Course.is_active == True)
    
    if level:
        query = query.filter(Course.level == level)
    
    courses = query.all()
    
    # Get user progress for each course
    result = []
    for course in courses:
        progress = db.query(UserCourseProgress).filter(
            UserCourseProgress.user_id == current_user.id,
            UserCourseProgress.course_id == course.id
        ).first()
        
        result.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "level": course.level,
            "duration": course.duration,
            "xp_available": course.xp_available,
            "progress_percentage": progress.progress_percentage if progress else 0,
            "is_completed": progress.is_completed if progress else False,
            "xp_earned": progress.xp_earned if progress else 0
        })
    
    return result

@router.get("/courses/{course_id}", response_model=dict)
async def get_course_details(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed course information"""
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    progress = db.query(UserCourseProgress).filter(
        UserCourseProgress.user_id == current_user.id,
        UserCourseProgress.course_id == course_id
    ).first()
    
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "level": course.level,
        "duration": course.duration,
        "content_type": course.content_type,
        "content_url": course.content_url,
        "topics": course.topics,
        "xp_available": course.xp_available,
        "progress_percentage": progress.progress_percentage if progress else 0,
        "is_completed": progress.is_completed if progress else False,
        "xp_earned": progress.xp_earned if progress else 0,
        "time_spent": progress.time_spent if progress else 0,
        "quiz_score": progress.quiz_score if progress else None
    }

@router.post("/courses/{course_id}/start")
async def start_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if progress already exists
    progress = db.query(UserCourseProgress).filter(
        UserCourseProgress.user_id == current_user.id,
        UserCourseProgress.course_id == course_id
    ).first()
    
    if not progress:
        progress = UserCourseProgress(
            user_id=current_user.id,
            course_id=course_id,
            progress_percentage=0,
            xp_earned=0,
            is_completed=False
        )
        db.add(progress)
    
    progress.last_accessed = datetime.now()
    db.commit()
    
    return {"message": f"Started course: {course.title}"}

@router.put("/courses/{course_id}/progress")
async def update_course_progress(
    course_id: int,
    progress_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update course progress"""
    progress = db.query(UserCourseProgress).filter(
        UserCourseProgress.user_id == current_user.id,
        UserCourseProgress.course_id == course_id
    ).first()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Course progress not found")
    
    # Update progress
    if "progress_percentage" in progress_data:
        progress.progress_percentage = progress_data["progress_percentage"]
    
    if "time_spent" in progress_data:
        progress.time_spent += progress_data["time_spent"]
    
    if "quiz_score" in progress_data:
        progress.quiz_score = progress_data["quiz_score"]
    
    # Check if course is completed
    if progress.progress_percentage >= 100 and not progress.is_completed:
        progress.is_completed = True
        progress.completed_at = datetime.now()
        progress.xp_earned = db.query(Course).filter(Course.id == course_id).first().xp_available
    
    progress.last_accessed = datetime.now()
    db.commit()
    
    return {"message": "Progress updated successfully"}

@router.get("/achievements", response_model=List[dict])
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user achievements"""
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    result = []
    for ua in user_achievements:
        achievement = db.query(Achievement).filter(Achievement.id == ua.achievement_id).first()
        if achievement:
            result.append({
                "id": achievement.id,
                "name": achievement.name,
                "description": achievement.description,
                "icon": achievement.icon,
                "xp_reward": achievement.xp_reward,
                "earned_at": ua.earned_at
            })
    
    return result

@router.get("/leaderboard")
async def get_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get learning leaderboard"""
    # Get all users with their total XP from completed courses
    users_xp = db.query(
        User.id,
        User.username,
        db.func.sum(UserCourseProgress.xp_earned).label('total_xp'),
        db.func.count(UserCourseProgress.course_id).label('courses_completed')
    ).join(UserCourseProgress).filter(
        UserCourseProgress.is_completed == True
    ).group_by(User.id, User.username).order_by(
        db.func.sum(UserCourseProgress.xp_earned).desc()
    ).limit(10).all()
    
    return [
        {
            "rank": i + 1,
            "user_id": user.id,
            "username": user.username,
            "total_xp": user.total_xp or 0,
            "courses_completed": user.courses_completed or 0
        }
        for i, user in enumerate(users_xp)
    ] 