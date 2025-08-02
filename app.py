import streamlit as st
import streamlit_authenticator as stauth
from streamlit_option_menu import option_menu
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Import custom modules
from src.auth import AuthManager
from src.dashboard import Dashboard
from src.expense_tracker import ExpenseTracker
from src.subscription_detox import SubscriptionDetox
from src.wallet_chat import WalletChat
from src.investment_tracker import InvestmentTracker
from src.learning_modules import LearningModules
from src.personality_profiler import PersonalityProfiler
from src.ai_journal import AIJournal

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="FinMate - AI-Powered Personal Finance Assistant",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    
    .sidebar .sidebar-content {
        background-color: #f8f9fa;
    }
    
    .stButton > button {
        width: 100%;
        border-radius: 0.5rem;
        font-weight: bold;
    }
    
    .stSelectbox > div > div > div {
        border-radius: 0.5rem;
    }
    
    .stTextInput > div > div > input {
        border-radius: 0.5rem;
    }
    
    .stTextArea > div > div > textarea {
        border-radius: 0.5rem;
    }
    
    .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #c3e6cb;
    }
    
    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #f5c6cb;
    }
    
    .info-message {
        background-color: #d1ecf1;
        color: #0c5460;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #bee5eb;
    }
</style>
""", unsafe_allow_html=True)

class FinMateApp:
    def __init__(self):
        self.auth_manager = AuthManager()
        self.dashboard = Dashboard()
        self.expense_tracker = ExpenseTracker()
        self.subscription_detox = SubscriptionDetox()
        self.wallet_chat = WalletChat()
        self.investment_tracker = InvestmentTracker()
        self.learning_modules = LearningModules()
        self.personality_profiler = PersonalityProfiler()
        self.ai_journal = AIJournal()
        
        # Initialize session state
        if 'authenticated' not in st.session_state:
            st.session_state.authenticated = False
        if 'user_id' not in st.session_state:
            st.session_state.user_id = None
        if 'user_name' not in st.session_state:
            st.session_state.user_name = None
    
    def show_login_page(self):
        """Show login/signup page"""
        st.markdown('<h1 class="main-header">💰 FinMate</h1>', unsafe_allow_html=True)
        st.markdown('<p style="text-align: center; font-size: 1.2rem; color: #666;">AI-Powered Personal Finance Assistant</p>', unsafe_allow_html=True)
        
        # Create two columns for login and signup
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🔐 Login")
            self.auth_manager.show_login()
        
        with col2:
            st.markdown("### 📝 Sign Up")
            self.auth_manager.show_signup()
        
        # Show features preview
        st.markdown("---")
        st.markdown("### 🚀 Features")
        
        features_col1, features_col2, features_col3 = st.columns(3)
        
        with features_col1:
            st.markdown("""
            **🤖 AI-Powered Insights**
            - Smart transaction categorization
            - Personalized financial recommendations
            - Predictive spending analysis
            """)
        
        with features_col2:
            st.markdown("""
            **📊 Comprehensive Tracking**
            - Expense & income management
            - Investment portfolio analysis
            - Subscription optimization
            """)
        
        with features_col3:
            st.markdown("""
            **🎯 Financial Wellness**
            - Personality profiling
            - Learning modules
            - AI-powered journaling
            """)
    
    def show_sidebar(self):
        """Show sidebar navigation"""
        with st.sidebar:
            st.markdown("## 💰 FinMate")
            st.markdown("AI-Powered Personal Finance")
            st.markdown("---")
            
            # User info
            if st.session_state.authenticated:
                st.success(f"Welcome, {st.session_state.user_name}!")
                st.markdown("---")
            
            # Navigation menu
            selected = option_menu(
                menu_title="Navigation",
                options=[
                    "🏠 Dashboard",
                    "💳 Expense Tracker", 
                    "📦 Subscription Detox",
                    "🤖 Wallet Chat",
                    "📈 Investment Tracker",
                    "📚 Learning Modules",
                    "🧠 Personality Profiler",
                    "📝 AI Journal"
                ],
                icons=[
                    "house",
                    "credit-card",
                    "box",
                    "chat",
                    "graph-up",
                    "book",
                    "brain",
                    "journal"
                ],
                menu_icon="list",
                default_index=0,
                styles={
                    "container": {"padding": "0!important", "background-color": "#fafafa"},
                    "icon": {"color": "#1f77b4", "font-size": "18px"},
                    "nav-link": {"font-size": "16px", "text-align": "left", "margin": "0px", "--hover-color": "#eee"},
                    "nav-link-selected": {"background-color": "#1f77b4"},
                }
            )
            
            st.markdown("---")
            
            # Quick actions
            if st.session_state.authenticated:
                st.markdown("### ⚡ Quick Actions")
                
                if st.button("➕ Add Transaction", use_container_width=True):
                    st.session_state.show_add_transaction = True
                
                if st.button("📊 View Analytics", use_container_width=True):
                    st.session_state.show_analytics = True
                
                if st.button("🎯 Set Goal", use_container_width=True):
                    st.session_state.show_goal_setting = True
                
                st.markdown("---")
                
                # Logout button
                if st.button("🚪 Logout", use_container_width=True):
                    st.session_state.authenticated = False
                    st.session_state.user_id = None
                    st.session_state.user_name = None
                    st.rerun()
            
            # Footer
            st.markdown("---")
            st.markdown("### 📈 Financial Health")
            if st.session_state.authenticated:
                # Mock financial health metrics
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Savings Rate", "25%", "+5%")
                with col2:
                    st.metric("Budget Score", "85/100", "+10")
            
            st.markdown("---")
            st.markdown("*Powered by AI/ML/NLP*")
            
            return selected
    
    def show_main_content(self, selected):
        """Show main content based on navigation selection"""
        if selected == "🏠 Dashboard":
            self.dashboard.show()
        
        elif selected == "💳 Expense Tracker":
            self.expense_tracker.show()
        
        elif selected == "📦 Subscription Detox":
            self.subscription_detox.show()
        
        elif selected == "🤖 Wallet Chat":
            self.wallet_chat.show()
        
        elif selected == "📈 Investment Tracker":
            self.investment_tracker.show()
        
        elif selected == "📚 Learning Modules":
            self.learning_modules.show()
        
        elif selected == "🧠 Personality Profiler":
            self.personality_profiler.show()
        
        elif selected == "📝 AI Journal":
            self.ai_journal.show()
    
    def show_welcome_screen(self):
        """Show welcome screen for new users"""
        st.markdown('<h1 class="main-header">🎉 Welcome to FinMate!</h1>', unsafe_allow_html=True)
        
        st.markdown("""
        ### 🚀 Getting Started
        
        FinMate is your AI-powered personal finance assistant that helps you:
        
        - **Track expenses** with smart categorization
        - **Analyze spending patterns** using ML
        - **Get personalized recommendations** based on your personality
        - **Learn financial skills** through interactive modules
        - **Journal your financial journey** with AI insights
        
        ### 📋 Quick Setup
        
        Let's get you started with a few simple steps:
        """)
        
        # Setup wizard
        with st.expander("🎯 Step 1: Set Your Financial Goals", expanded=True):
            goal_type = st.selectbox(
                "What's your primary financial goal?",
                ["Build Emergency Fund", "Save for Retirement", "Pay Off Debt", "Invest for Growth", "Other"]
            )
            
            if goal_type != "Other":
                target_amount = st.number_input(
                    f"Target amount for {goal_type.lower()}",
                    min_value=0,
                    value=10000,
                    step=1000
                )
                
                timeline = st.selectbox(
                    "Timeline for achieving this goal",
                    ["6 months", "1 year", "2 years", "5 years", "10+ years"]
                )
        
        with st.expander("💰 Step 2: Income & Budget Setup"):
            monthly_income = st.number_input(
                "Monthly income",
                min_value=0,
                value=5000,
                step=500
            )
            
            monthly_expenses = st.number_input(
                "Monthly expenses",
                min_value=0,
                value=3000,
                step=500
            )
            
            if monthly_income > 0:
                savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
                st.success(f"Your current savings rate: {savings_rate:.1f}%")
        
        with st.expander("🧠 Step 3: Personality Assessment"):
            st.info("This helps us provide personalized recommendations.")
            
            risk_tolerance = st.selectbox(
                "How would you describe your risk tolerance?",
                ["Very Conservative", "Conservative", "Moderate", "Aggressive", "Very Aggressive"]
            )
            
            financial_knowledge = st.selectbox(
                "How would you rate your financial knowledge?",
                ["Beginner", "Intermediate", "Advanced", "Expert"]
            )
            
            if st.button("Complete Setup", use_container_width=True):
                st.success("🎉 Setup complete! Welcome to FinMate!")
                st.balloons()
                st.session_state.setup_complete = True
    
    def run(self):
        """Main application runner"""
        # Check authentication
        if not st.session_state.authenticated:
            self.show_login_page()
            return
        
        # Show sidebar and get navigation selection
        selected = self.show_sidebar()
        
        # Show main content
        self.show_main_content(selected)
        
        # Show welcome screen for new users
        if not st.session_state.get('setup_complete', False):
            with st.expander("🎉 Welcome! Complete Your Setup", expanded=True):
                self.show_welcome_screen()

def main():
    """Main function to run the FinMate application"""
    app = FinMateApp()
    app.run()

if __name__ == "__main__":
    main() 