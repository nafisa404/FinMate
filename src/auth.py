import streamlit as st
import streamlit_authenticator as stauth
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import hashlib
import secrets

load_dotenv()

class AuthManager:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if self.supabase_url and self.supabase_key:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        else:
            st.error("Supabase credentials not found. Please check your .env file.")
            self.supabase = None
    
    def is_authenticated(self):
        """Check if user is authenticated"""
        return st.session_state.get("authenticated", False)
    
    def show_login_form(self):
        """Display login form"""
        st.subheader("🔐 Login to FinMate")
        
        with st.form("login_form"):
            email = st.text_input("Email", placeholder="your.email@example.com")
            password = st.text_input("Password", type="password", placeholder="Enter your password")
            
            col1, col2 = st.columns(2)
            with col1:
                submitted = st.form_submit_button("Login", use_container_width=True)
            with col2:
                if st.form_submit_button("Forgot Password?", use_container_width=True):
                    self.show_forgot_password()
            
            if submitted and email and password:
                if self.authenticate_user(email, password):
                    st.success("Login successful! 🎉")
                    st.rerun()
                else:
                    st.error("Invalid email or password. Please try again.")
    
    def show_signup_form(self):
        """Display signup form"""
        st.subheader("📝 Create Your FinMate Account")
        
        with st.form("signup_form"):
            full_name = st.text_input("Full Name", placeholder="John Doe")
            email = st.text_input("Email", placeholder="your.email@example.com")
            password = st.text_input("Password", type="password", placeholder="Create a strong password")
            confirm_password = st.text_input("Confirm Password", type="password", placeholder="Confirm your password")
            
            # Financial profile questions
            st.markdown("### 📊 Financial Profile")
            age = st.number_input("Age", min_value=18, max_value=100, value=25)
            income_bracket = st.selectbox(
                "Income Bracket",
                ["Under $25k", "$25k-$50k", "$50k-$75k", "$75k-$100k", "Over $100k"]
            )
            financial_goals = st.multiselect(
                "Financial Goals",
                ["Save for Emergency Fund", "Pay off Debt", "Invest in Stocks", 
                 "Save for Retirement", "Buy a House", "Travel", "Other"]
            )
            
            submitted = st.form_submit_button("Create Account", use_container_width=True)
            
            if submitted:
                if not all([full_name, email, password, confirm_password]):
                    st.error("Please fill in all required fields.")
                    return
                
                if password != confirm_password:
                    st.error("Passwords do not match.")
                    return
                
                if len(password) < 8:
                    st.error("Password must be at least 8 characters long.")
                    return
                
                if self.register_user(full_name, email, password, age, income_bracket, financial_goals):
                    st.success("Account created successfully! Please log in.")
                else:
                    st.error("Failed to create account. Email might already be registered.")
    
    def show_forgot_password(self):
        """Display forgot password form"""
        st.subheader("🔑 Reset Password")
        
        with st.form("forgot_password_form"):
            email = st.text_input("Email", placeholder="your.email@example.com")
            submitted = st.form_submit_button("Send Reset Link", use_container_width=True)
            
            if submitted and email:
                # In a real app, you would send a reset email
                st.info("Reset link sent to your email (demo mode)")
    
    def authenticate_user(self, email: str, password: str) -> bool:
        """Authenticate user with Supabase"""
        try:
            if not self.supabase:
                return False
            
            # Hash password for comparison
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            
            # Query user from database
            response = self.supabase.table("users").select("*").eq("email", email).execute()
            
            if response.data:
                user = response.data[0]
                if user.get("password_hash") == hashed_password:
                    # Set session state
                    st.session_state.authenticated = True
                    st.session_state.user_id = user["id"]
                    st.session_state.user_name = user["full_name"]
                    st.session_state.user_email = user["email"]
                    st.session_state.user_age = user.get("age", 25)
                    st.session_state.income_bracket = user.get("income_bracket", "$50k-$75k")
                    return True
            
            return False
            
        except Exception as e:
            st.error(f"Authentication error: {str(e)}")
            return False
    
    def register_user(self, full_name: str, email: str, password: str, age: int, 
                     income_bracket: str, financial_goals: list) -> bool:
        """Register new user with Supabase"""
        try:
            if not self.supabase:
                return False
            
            # Hash password
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            
            # Check if user already exists
            existing_user = self.supabase.table("users").select("id").eq("email", email).execute()
            if existing_user.data:
                return False
            
            # Insert new user
            user_data = {
                "full_name": full_name,
                "email": email,
                "password_hash": hashed_password,
                "age": age,
                "income_bracket": income_bracket,
                "financial_goals": financial_goals,
                "created_at": "now()"
            }
            
            response = self.supabase.table("users").insert(user_data).execute()
            
            if response.data:
                return True
            return False
            
        except Exception as e:
            st.error(f"Registration error: {str(e)}")
            return False
    
    def logout(self):
        """Logout user"""
        for key in ["authenticated", "user_id", "user_name", "user_email", "user_age", "income_bracket"]:
            if key in st.session_state:
                del st.session_state[key]
        
        st.success("Logged out successfully!")
    
    def get_current_user(self):
        """Get current user data"""
        if self.is_authenticated():
            return {
                "id": st.session_state.get("user_id"),
                "name": st.session_state.get("user_name"),
                "email": st.session_state.get("user_email"),
                "age": st.session_state.get("user_age"),
                "income_bracket": st.session_state.get("income_bracket")
            }
        return None 