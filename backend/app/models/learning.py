from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Numeric, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Course details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String(50), nullable=False)  # beginner, intermediate, advanced
    duration = Column(Integer, nullable=True)  # in minutes
    
    # Content
    content_type = Column(String(50), nullable=False)  # video, text, interactive, quiz
    content_url = Column(String(500), nullable=True)
    topics = Column(Text, nullable=True)  # JSON array of topics
    
    # Rewards
    xp_available = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Dates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_progress = relationship("UserCourseProgress", back_populates="course")
    
    def __repr__(self):
        return f"<Course(id={self.id}, title='{self.title}', level='{self.level}')>"

class UserCourseProgress(Base):
    __tablename__ = "user_course_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    # Progress tracking
    progress_percentage = Column(Numeric(5, 2), default=0)  # 0.00 to 100.00
    xp_earned = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    
    # Learning analytics
    time_spent = Column(Integer, default=0)  # in minutes
    quiz_score = Column(Numeric(5, 2), nullable=True)  # 0.00 to 100.00
    last_accessed = Column(DateTime, nullable=True)
    
    # Dates
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="course_progress")
    course = relationship("Course", back_populates="user_progress")
    
    def __repr__(self):
        return f"<UserCourseProgress(user_id={self.user_id}, course_id={self.course_id}, progress={self.progress_percentage}%)>"

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Achievement details
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    
    # Requirements
    requirement_type = Column(String(50), nullable=False)  # courses_completed, xp_earned, streak_days, etc.
    requirement_value = Column(Integer, nullable=False)
    
    # Rewards
    xp_reward = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Dates
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")
    
    def __repr__(self):
        return f"<Achievement(id={self.id}, name='{self.name}')>"

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    
    # Earned date
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
    
    def __repr__(self):
        return f"<UserAchievement(user_id={self.user_id}, achievement_id={self.achievement_id})>" 