import streamlit as st

def run():
    st.title("🎓 FinMate Quiz Zone")

    st.markdown("#### Question 1: What is an ELSS?")
    ans1 = st.radio("", ["Fixed Deposit", "Tax-saving Mutual Fund", "Pension Fund"])
    if st.button("Submit Q1"):
        if ans1 == "Tax-saving Mutual Fund":
            st.success("✅ Correct!")
        else:
            st.error("❌ Incorrect! ELSS is a Tax-saving Mutual Fund.")

    st.markdown("---")
    st.markdown("More quiz levels coming soon! 🚀")