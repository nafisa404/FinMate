# SIP tracker + suggestion
import streamlit as st
from models.investment_advisor import suggest_investment_strategy
from models.roi_calculator import calculate_roi, calculate_cagr

def run():
    st.title("💸 Investment Planner")

    amt = st.number_input("Investment Amount (₹)", step=1000.0, value=10000.0)
    risk = st.selectbox("Risk Appetite", ["conservative", "moderate", "aggressive"])

    st.markdown("### 📊 Suggested Portfolio")
    alloc = suggest_investment_strategy(risk, amt)
    for k, v in alloc.items():
        st.write(f"- {k}: ₹{v}")

    st.markdown("---")
    st.markdown("### 📈 ROI & CAGR Calculator")

    col1, col2, col3 = st.columns(3)
    with col1:
        invested = st.number_input("Invested Amount", value=10000.0)
    with col2:
        current = st.number_input("Current Value", value=12500.0)
    with col3:
        years = st.number_input("Years", value=1.0)

    if st.button("Calculate"):
        roi = calculate_roi(invested, current)
        cagr = calculate_cagr(invested, current, years)
        st.success(f"ROI: {roi}% | CAGR: {cagr}%")
