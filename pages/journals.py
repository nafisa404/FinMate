import streamlit as st
import os

def run():
    st.title("📘 Money Journals")

    user = st.session_state['user']
    path = f"data/journals/{user}.txt"
    os.makedirs(os.path.dirname(path), exist_ok=True)

    if os.path.exists(path):
        with open(path, "r") as f:
            content = f.read()
    else:
        content = ""

    st.text_area("✍ Write your financial journey", value=content, height=300, key="journal_text")

    if st.button("💾 Save Entry"):
        with open(path, "w") as f:
            f.write(st.session_state["journal_text"])
        st.success("Journal saved!")