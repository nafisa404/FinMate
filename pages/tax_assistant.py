# 80C/80D insights
import streamlit as st
from utils.db import get_tax_related_expenses

def run():
    st.title("🧾 Tax Planner & Optimizer")

    summary = get_tax_related_expenses(st.session_state['user'])

    st.markdown("### 📌 Detected Eligible Deductions")
    st.write(f"**Section 80C**: ₹{summary['80C']}")
    st.write(f"**Section 80D**: ₹{summary['80D']}")

    total = summary["80C"] + summary["80D"]
    max_limit = 150000 + 25000
    st.success(f"✅ Total Claimed: ₹{total} / ₹{max_limit}")

    if total < max_limit:
        st.warning(f"You can still save ₹{max_limit - total} in taxes. Consider investing in PPF, ELSS, or medical insurance.")
