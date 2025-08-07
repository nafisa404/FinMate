# AI budget planner
import streamlit as st
from models.budget_recommender import recommend_budget
from utils.db import get_user_transactions

def run():
    st.title("🧠 Smart Budget Recommender")

    df = get_user_transactions(st.session_state['user'])

    if df.empty:
        st.warning("Add some transactions to get recommendations.")
        return

    st.info("Generating personalized monthly budget using AI...")

    budget = recommend_budget(df)

    st.markdown("### 📋 Recommended Budget (₹):")
    for category, amt in budget.items():
        st.write(f"- **{category}**: ₹{amt}")
