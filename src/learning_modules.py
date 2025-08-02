import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json

class LearningModules:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.courses = self.get_courses()
        self.user_progress = self.get_user_progress()
        self.ai_recommendations = self.initialize_ai_recommendations()
        
    def show(self):
        st.title("📚 Financial Learning Modules")
        st.markdown("---")
        
        # Learning overview
        self.show_learning_overview()
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "🎓 Courses", 
            "🤖 AI Learning Path", 
            "🏆 Achievements", 
            "📊 Progress Analytics"
        ])
        
        with tab1:
            self.show_courses()
        
        with tab2:
            self.show_ai_learning_path()
        
        with tab3:
            self.show_achievements()
        
        with tab4:
            self.show_progress_analytics()
    
    def initialize_ai_recommendations(self):
        """Initialize AI recommendation system"""
        return {
            'content_recommender': None,  # Would use collaborative filtering
            'difficulty_adjuster': None,   # Would use ML to adjust difficulty
            'progress_predictor': None     # Would predict completion likelihood
        }
    
    def show_learning_overview(self):
        """Display learning overview metrics"""
        st.subheader("📊 Learning Overview")
        
        # Calculate learning metrics
        total_courses = len(self.courses)
        completed_courses = len([c for c in self.courses if c['completed']])
        total_xp = sum(c['xp_earned'] for c in self.courses if c['completed'])
        current_streak = self.calculate_learning_streak()
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="📚 Courses Completed",
                value=f"{completed_courses}/{total_courses}",
                delta=f"{completed_courses/total_courses*100:.1f}%",
                delta_color="normal"
            )
        
        with col2:
            st.metric(
                label="⭐ Total XP",
                value=f"{total_xp:,}",
                delta="+150 this week",
                delta_color="normal"
            )
        
        with col3:
            st.metric(
                label="🔥 Learning Streak",
                value=f"{current_streak} days",
                delta="+3 days",
                delta_color="normal"
            )
        
        with col4:
            completion_rate = (completed_courses / total_courses) * 100 if total_courses > 0 else 0
            st.metric(
                label="🎯 Completion Rate",
                value=f"{completion_rate:.1f}%",
                delta="+5% this month",
                delta_color="normal"
            )
    
    def show_courses(self):
        """Show available courses with AI recommendations"""
        st.subheader("🎓 Available Courses")
        
        # Course categories
        categories = ["Beginner", "Intermediate", "Advanced", "Specialized"]
        selected_category = st.selectbox("Filter by Level", ["All"] + categories)
        
        # Filter courses
        if selected_category == "All":
            filtered_courses = self.courses
        else:
            filtered_courses = [c for c in self.courses if c['level'] == selected_category]
        
        # Display courses
        for course in filtered_courses:
            with st.expander(f"{course['title']} - {course['level']} ({course['duration']} min)"):
                col1, col2, col3 = st.columns([2, 1, 1])
                
                with col1:
                    st.markdown(f"**Description:** {course['description']}")
                    st.markdown(f"**Topics:** {', '.join(course['topics'])}")
                    
                    # Progress bar
                    if course['completed']:
                        st.success("✅ Completed")
                    else:
                        progress = course['progress']
                        st.progress(progress / 100)
                        st.caption(f"Progress: {progress}%")
                
                with col2:
                    st.metric(
                        "XP Available",
                        f"{course['xp_available']}",
                        f"{course['xp_earned']} earned"
                    )
                
                with col3:
                    # AI recommendation
                    recommendation = self.get_course_recommendation(course)
                    st.markdown(f"**🤖 AI:** {recommendation}")
                
                # Course actions
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    if st.button("📖 Start Learning", key=f"start_{course['id']}"):
                        self.start_course(course)
                
                with col2:
                    if st.button("📝 Take Quiz", key=f"quiz_{course['id']}"):
                        self.take_quiz(course)
                
                with col3:
                    if st.button("📊 View Details", key=f"details_{course['id']}"):
                        self.show_course_details(course)
    
    def show_ai_learning_path(self):
        """Show AI-generated personalized learning path"""
        st.subheader("🤖 AI-Powered Learning Path")
        
        # AI recommendations
        recommendations = self.generate_ai_recommendations()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🎯 Personalized Recommendations")
            
            for i, rec in enumerate(recommendations['personalized'], 1):
                st.info(f"**{i}. {rec['title']}**\n{rec['reason']}")
        
        with col2:
            st.markdown("### 📈 Learning Path")
            
            # Visual learning path
            path_data = [
                {"Step": 1, "Course": "Budgeting Basics", "Status": "Completed"},
                {"Step": 2, "Course": "Emergency Fund", "Status": "In Progress"},
                {"Step": 3, "Course": "Investment Fundamentals", "Status": "Recommended"},
                {"Step": 4, "Course": "Tax Planning", "Status": "Locked"},
                {"Step": 5, "Course": "Retirement Planning", "Status": "Locked"}
            ]
            
            df_path = pd.DataFrame(path_data)
            
            fig = px.line(
                df_path,
                x='Step',
                y=[1, 1, 1, 1, 1],  # Dummy y values for visualization
                title="Your Learning Journey",
                markers=True
            )
            
            fig.update_layout(height=300)
            st.plotly_chart(fig, use_container_width=True)
        
        # AI insights
        st.markdown("### 🧠 AI Learning Insights")
        
        insights = [
            "You learn best in the morning - schedule study sessions before 10 AM",
            "You prefer interactive content over reading - focus on video courses",
            "Your retention rate is 85% - excellent!",
            "Consider taking 'Advanced Investment Strategies' next"
        ]
        
        for insight in insights:
            st.success(insight)
    
    def show_achievements(self):
        """Show gamification achievements and badges"""
        st.subheader("🏆 Achievements & Badges")
        
        # User achievements
        achievements = self.get_user_achievements()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🎖️ Your Achievements")
            
            for achievement in achievements['earned']:
                st.markdown(f"🏅 **{achievement['name']}** - {achievement['description']}")
                st.caption(f"Earned on {achievement['date']}")
                st.markdown("---")
        
        with col2:
            st.markdown("### 🔒 Available Badges")
            
            for badge in achievements['available']:
                progress = badge['progress']
                st.markdown(f"🔒 **{badge['name']}** - {badge['description']}")
                st.progress(progress / 100)
                st.caption(f"Progress: {progress}%")
                st.markdown("---")
        
        # Leaderboard
        st.markdown("### 🏆 Leaderboard")
        
        leaderboard = self.get_leaderboard()
        
        for i, user in enumerate(leaderboard, 1):
            col1, col2, col3 = st.columns([1, 3, 1])
            
            with col1:
                if i == 1:
                    st.markdown("🥇")
                elif i == 2:
                    st.markdown("🥈")
                elif i == 3:
                    st.markdown("🥉")
                else:
                    st.markdown(f"#{i}")
            
            with col2:
                st.markdown(f"**{user['name']}**")
                st.caption(f"{user['courses_completed']} courses completed")
            
            with col3:
                st.markdown(f"**{user['xp']:,} XP**")
    
    def show_progress_analytics(self):
        """Show detailed learning analytics with ML insights"""
        st.subheader("📊 Learning Analytics")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Learning progress over time
            st.markdown("### 📈 Learning Progress")
            
            # Mock progress data
            dates = pd.date_range(start='2024-01-01', end='2024-01-31', freq='D')
            progress_data = []
            
            for date in dates:
                progress_data.append({
                    'Date': date,
                    'XP Earned': np.random.randint(0, 50),
                    'Courses Completed': np.random.randint(0, 2),
                    'Study Time (min)': np.random.randint(0, 120)
                })
            
            df_progress = pd.DataFrame(progress_data)
            
            fig = go.Figure()
            
            fig.add_trace(go.Scatter(
                x=df_progress['Date'],
                y=df_progress['XP Earned'].cumsum(),
                mode='lines+markers',
                name='Cumulative XP',
                line=dict(color='#28a745', width=3)
            ))
            
            fig.update_layout(
                title="Learning Progress Over Time",
                xaxis_title="Date",
                yaxis_title="Cumulative XP",
                height=400
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Learning patterns
            st.markdown("### 🧠 Learning Patterns")
            
            patterns = [
                "Peak learning time: 9-11 AM",
                "Average study session: 45 minutes",
                "Preferred content type: Video (70%)",
                "Quiz performance: 85% average",
                "Retention rate: 78%"
            ]
            
            for pattern in patterns:
                st.info(pattern)
        
        # ML-powered insights
        st.markdown("### 🤖 ML Learning Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**📊 Performance Analysis:**")
            st.success("Your learning pace is 20% faster than average")
            st.warning("Consider taking breaks every 45 minutes")
            st.info("You perform best with interactive content")
        
        with col2:
            st.markdown("**🎯 Recommendations:**")
            st.markdown("• Focus on investment courses next")
            st.markdown("• Try the advanced budgeting module")
            st.markdown("• Join study groups for better retention")
            st.markdown("• Set daily learning goals")
    
    def get_courses(self):
        """Get available courses"""
        return [
            {
                'id': 1,
                'title': 'Budgeting Basics',
                'description': 'Learn the fundamentals of creating and maintaining a budget',
                'level': 'Beginner',
                'duration': 30,
                'xp_available': 100,
                'xp_earned': 100,
                'progress': 100,
                'completed': True,
                'topics': ['Income tracking', 'Expense categorization', 'Budget creation']
            },
            {
                'id': 2,
                'title': 'Emergency Fund Mastery',
                'description': 'Build and maintain a solid emergency fund',
                'level': 'Beginner',
                'duration': 25,
                'xp_available': 150,
                'xp_earned': 75,
                'progress': 50,
                'completed': False,
                'topics': ['Emergency fund calculation', 'Saving strategies', 'Fund management']
            },
            {
                'id': 3,
                'title': 'Investment Fundamentals',
                'description': 'Understand the basics of investing and portfolio building',
                'level': 'Intermediate',
                'duration': 45,
                'xp_available': 200,
                'xp_earned': 0,
                'progress': 0,
                'completed': False,
                'topics': ['Stock market basics', 'Diversification', 'Risk management']
            },
            {
                'id': 4,
                'title': 'Tax Planning Strategies',
                'description': 'Learn how to optimize your taxes and save money',
                'level': 'Advanced',
                'duration': 60,
                'xp_available': 300,
                'xp_earned': 0,
                'progress': 0,
                'completed': False,
                'topics': ['Tax deductions', 'Retirement accounts', 'Tax-efficient investing']
            },
            {
                'id': 5,
                'title': 'Retirement Planning',
                'description': 'Plan for a secure and comfortable retirement',
                'level': 'Advanced',
                'duration': 90,
                'xp_available': 400,
                'xp_earned': 0,
                'progress': 0,
                'completed': False,
                'topics': ['401(k) optimization', 'Social Security', 'Retirement calculators']
            }
        ]
    
    def get_user_progress(self):
        """Get user learning progress"""
        return {
            'total_xp': 175,
            'courses_completed': 1,
            'learning_streak': 7,
            'study_time': 180,  # minutes
            'quiz_average': 85
        }
    
    def calculate_learning_streak(self):
        """Calculate current learning streak"""
        return 7  # Mock data
    
    def get_course_recommendation(self, course):
        """Get AI recommendation for a course"""
        if course['completed']:
            return "Great job! Consider advanced topics."
        elif course['progress'] > 50:
            return "You're doing well! Keep going."
        elif course['level'] == 'Beginner':
            return "Perfect starting point for your level."
        else:
            return "Consider completing prerequisites first."
    
    def generate_ai_recommendations(self):
        """Generate AI-powered learning recommendations"""
        return {
            'personalized': [
                {
                    'title': 'Complete Emergency Fund Course',
                    'reason': 'Based on your spending patterns, you need a stronger emergency fund'
                },
                {
                    'title': 'Start Investment Fundamentals',
                    'reason': 'You have excess savings that could be invested for growth'
                },
                {
                    'title': 'Advanced Budgeting Techniques',
                    'reason': 'Your basic budgeting skills are solid, time to level up'
                }
            ]
        }
    
    def get_user_achievements(self):
        """Get user achievements and available badges"""
        return {
            'earned': [
                {
                    'name': 'First Steps',
                    'description': 'Complete your first course',
                    'date': '2024-01-15'
                },
                {
                    'name': 'Budget Master',
                    'description': 'Create and maintain a budget for 30 days',
                    'date': '2024-01-20'
                }
            ],
            'available': [
                {
                    'name': 'Investment Guru',
                    'description': 'Complete 3 investment-related courses',
                    'progress': 33
                },
                {
                    'name': 'Learning Streak',
                    'description': 'Study for 30 consecutive days',
                    'progress': 23
                },
                {
                    'name': 'Quiz Champion',
                    'description': 'Score 90%+ on 10 quizzes',
                    'progress': 60
                }
            ]
        }
    
    def get_leaderboard(self):
        """Get learning leaderboard"""
        return [
            {'name': 'Sarah Johnson', 'courses_completed': 8, 'xp': 2500},
            {'name': 'Mike Chen', 'courses_completed': 6, 'xp': 2100},
            {'name': 'Emma Davis', 'courses_completed': 5, 'xp': 1800},
            {'name': 'Alex Thompson', 'courses_completed': 4, 'xp': 1500},
            {'name': 'You', 'courses_completed': 1, 'xp': 175}
        ]
    
    def start_course(self, course):
        """Start a course"""
        st.success(f"Starting course: {course['title']}")
        # In real app, this would navigate to course content
    
    def take_quiz(self, course):
        """Take a quiz for a course"""
        st.info(f"Taking quiz for: {course['title']}")
        # In real app, this would show quiz interface
    
    def show_course_details(self, course):
        """Show detailed course information"""
        st.info(f"Course details for: {course['title']}")
        # In real app, this would show detailed course information 