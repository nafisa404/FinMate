# Transactions UI
import streamlit as st
from utils.db import get_user_transactions

def run():
    st.title("💳 All Transactions")

    df = get_user_transactions(st.session_state['user'])

    if not df.empty:
        st.dataframe(df, use_container_width=True)
    else:
        st.info("No transactions found.")

    st.download_button("📥 Export CSV", df.to_csv(index=False), file_name="transactions.csv")
