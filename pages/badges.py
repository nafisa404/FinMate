import streamlit as st
from utils.gamify import get_user_badges

def run():
    st.title("🏅 Your Badges & Achievements")

    badges = get_user_badges(st.session_state['user'])

    st.markdown("### 🎖️ Earned Badges")
    if badges:
        for badge in badges:
            st.success(f"🏆 {badge}")
    else:
        st.info("No badges yet. Start saving, investing, and tracking!")

    st.markdown("### 🔒 Locked Badges")
    locked = [
        "📈 10% Monthly Saving Streak",
        "💳 First Credit Paid On-Time",
        "📘 5 Journals Written",
        "💸 ₹50K Investment Mark"
    ]
    for badge in locked:
        st.warning(f"🔒 {badge} — Complete tasks to unlock.")