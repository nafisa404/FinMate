# OCR UI
import streamlit as st
from PIL import Image
from ocr.receipt_parser import extract_receipt_data
from utils.db import get_connection
from datetime import datetime

def run():
    st.title("🧾 Scan Receipt")

    uploaded = st.file_uploader("Upload JPEG/PNG Receipt", type=["jpg", "jpeg", "png"])
    if uploaded:
        img = Image.open(uploaded)
        st.image(img, caption="Uploaded Receipt", use_column_width=True)

        result = extract_receipt_data(img)

        with st.form("save_receipt"):
            vendor = st.text_input("Vendor", result["vendor"])
            date = st.date_input("Date", result["date"] or datetime.today())
            amount = st.number_input("Amount (₹)", value=result["amount"] or 0.0, step=1.0)
            category = st.text_input("Predicted Category", result["category"])
            note = st.text_area("Notes", "")

            submitted = st.form_submit_button("Save")
            if submitted:
                user = st.session_state["user"]
                conn = get_connection()
                conn.execute('''
                    INSERT INTO transactions (username, vendor, date, amount, category, note)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (user, vendor, date.strftime("%Y-%m-%d"), amount, category, note))
                conn.commit()
                st.success("✅ Transaction saved successfully!")
