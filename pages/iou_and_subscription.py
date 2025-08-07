# IOU manager
import streamlit as st
from utils.db import get_ious, add_iou

def run():
    st.title("🤝 IOU Tracker")

    st.subheader("💸 People Who Owe You")
    df1 = get_ious(st.session_state['user'], mode="owed_to_me")
    st.dataframe(df1 if not df1.empty else "No entries.")

    st.subheader("🧾 People You Owe")
    df2 = get_ious(st.session_state['user'], mode="i_owe")
    st.dataframe(df2 if not df2.empty else "No entries.")

    st.markdown("---")
    st.subheader("➕ Add New IOU")

    with st.form("iou_form"):
        name = st.text_input("Person Name")
        amount = st.number_input("Amount", step=1.0)
        type_ = st.radio("Type", ["They owe me", "I owe them"])
        note = st.text_area("Note (optional)")

        submit = st.form_submit_button("Add IOU")
        if submit:
            direction = "owed_to_me" if type_ == "They owe me" else "i_owe"
            add_iou(st.session_state['user'], name, amount, direction, note)
            st.success("IOU recorded successfully!")
