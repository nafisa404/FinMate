import streamlit as st
from utils.gamify import get_user_badges, get_spending_level

def run():
    st.title("🎮 FinMate Gamification & Journals")

    level = get_spending_level(st.session_state['user'])
    badges = get_user_badges(st.session_state['user'])

    st.markdown(f"### 🧠 Your Spending Personality: **{level}**")

    st.markdown("### 🏅 Badges Earned")
    if badges:
        for b in badges:
            st.success(f"🏆 {b}")
    else:
        st.info("No badges earned yet. Start saving!")

    st.markdown("---")
    st.markdown("📘 **Journaling Module (Coming Soon)**")
    st.info("You'll soon be able to write financial thoughts and track money habits!")
