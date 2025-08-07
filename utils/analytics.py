import pandas as pd
import plotly.express as px
from utils.db import get_user_transactions

def get_summary_stats(username):
    df = get_user_transactions(username)
    income = df[df["amount"] > 0]["amount"].sum()
    expense = df[df["amount"] < 0]["amount"].sum()
    return {
        "income": round(income, 2),
        "expense": round(abs(expense), 2),
        "balance": round(income + expense, 2)
    }

def plot_spending_chart(username):
    df = get_user_transactions(username)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])

    if df.empty:
        return None

    df_grouped = df.groupby(df['date'].dt.to_period("M"))["amount"].sum().reset_index()
    df_grouped['date'] = df_grouped['date'].astype(str)
    fig = px.bar(df_grouped, x='date', y='amount', title="Monthly Net Spending")
    return fig
