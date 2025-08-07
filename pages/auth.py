# Login/signup
import streamlit as st
from utils.db import validate_user, create_user

def login_page():
    st.title("🔐 Login to FinMate")

    menu = ["Login", "Signup"]
    choice = st.radio("Select Option", menu)

    if choice == "Login":
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        if st.button("Login"):
            if validate_user(username, password):
                st.session_state['user'] = username
                st.success(f"Welcome back, {username}!")
                st.switch_page("app.py")
            else:
                st.error("Invalid credentials.")

    else:
        st.subheader("Create Account")
        new_user = st.text_input("New Username")
        new_pass = st.text_input("New Password", type="password")
        if st.button("Signup"):
            if create_user(new_user, new_pass):
                st.success("Account created. Please login.")
            else:
                st.error("Username already exists.")