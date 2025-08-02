import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np

class Dashboard:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
    
    def show(self):
        st.title("🏠 Financial Dashboard")
        st.markdown("---")
        
        # Welcome message
        user_name = st.session_state.get("user_name", "User")
        st.markdown(f"### Welcome back, {user_name}! 👋")
        
        # Key metrics row
        self.show_key_metrics()
        
        # Charts row
        col1, col2 = st.columns(2)
        
        with col1:
            self.show_expense_chart()
        
        with col2:
            self.show_income_vs_expense_chart()
        
        # Budget progress and recent transactions
        col1, col2 = st.columns(2)
        
        with col1:
            self.show_budget_progress()
        
        with col2:
            self.show_recent_transactions()
        
        # Financial insights
        self.show_financial_insights()
    
    def show_key_metrics(self):
        """Display key financial metrics"""
        st.subheader("📊 Key Metrics")
        
        # Mock data - in real app, this would come from database
        current_month = datetime.now().month
        mock_data = self.get_mock_financial_data()
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="💰 Total Balance",
                value=f"${mock_data['total_balance']:,.2f}",
                delta=f"${mock_data['balance_change']:+,.2f}",
                delta_color="normal" if mock_data['balance_change'] >= 0 else "inverse"
            )
        
        with col2:
            st.metric(
                label="📈 Monthly Income",
                value=f"${mock_data['monthly_income']:,.2f}",
                delta=f"${mock_data['income_change']:+,.2f}",
                delta_color="normal" if mock_data['income_change'] >= 0 else "inverse"
            )
        
        with col3:
            st.metric(
                label="💸 Monthly Expenses",
                value=f"${mock_data['monthly_expenses']:,.2f}",
                delta=f"${mock_data['expense_change']:+,.2f}",
                delta_color="inverse" if mock_data['expense_change'] >= 0 else "normal"
            )
        
        with col4:
            savings_rate = ((mock_data['monthly_income'] - mock_data['monthly_expenses']) / mock_data['monthly_income']) * 100
            st.metric(
                label="🎯 Savings Rate",
                value=f"{savings_rate:.1f}%",
                delta=f"{mock_data['savings_rate_change']:+.1f}%",
                delta_color="normal" if mock_data['savings_rate_change'] >= 0 else "inverse"
            )
    
    def show_expense_chart(self):
        """Display expense breakdown chart"""
        st.subheader("💳 Expense Breakdown")
        
        # Mock expense data
        expense_data = {
            'Category': ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare'],
            'Amount': [450, 320, 280, 180, 150, 120]
        }
        
        df = pd.DataFrame(expense_data)
        
        fig = px.pie(
            df, 
            values='Amount', 
            names='Category',
            title="Monthly Expenses by Category",
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        
        fig.update_layout(
            height=400,
            showlegend=True,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    def show_income_vs_expense_chart(self):
        """Display income vs expense trend"""
        st.subheader("📈 Income vs Expenses Trend")
        
        # Mock trend data
        dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='M')
        income_data = [3200, 3400, 3300, 3600, 3500, 3800, 3700, 3900, 3800, 4000, 4200, 4500]
        expense_data = [2800, 2900, 3100, 3000, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900]
        
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(
            x=dates,
            y=income_data,
            mode='lines+markers',
            name='Income',
            line=dict(color='#28a745', width=3),
            marker=dict(size=8)
        ))
        
        fig.add_trace(go.Scatter(
            x=dates,
            y=expense_data,
            mode='lines+markers',
            name='Expenses',
            line=dict(color='#dc3545', width=3),
            marker=dict(size=8)
        ))
        
        fig.update_layout(
            title="Monthly Income vs Expenses",
            xaxis_title="Month",
            yaxis_title="Amount ($)",
            height=400,
            hovermode='x unified'
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    def show_budget_progress(self):
        """Display budget progress for different categories"""
        st.subheader("🎯 Budget Progress")
        
        # Mock budget data
        budget_data = {
            'Category': ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment'],
            'Budget': [500, 400, 300, 200, 200],
            'Spent': [450, 320, 280, 180, 150],
            'Percentage': [90, 80, 93, 90, 75]
        }
        
        df = pd.DataFrame(budget_data)
        
        for _, row in df.iterrows():
            col1, col2 = st.columns([3, 1])
            
            with col1:
                st.progress(row['Percentage'] / 100)
            
            with col2:
                color = "green" if row['Percentage'] <= 80 else "orange" if row['Percentage'] <= 95 else "red"
                st.markdown(f"<span style='color: {color}; font-weight: bold;'>{row['Percentage']}%</span>", unsafe_allow_html=True)
            
            st.caption(f"{row['Category']}: ${row['Spent']:,.0f} / ${row['Budget']:,.0f}")
            st.markdown("---")
    
    def show_recent_transactions(self):
        """Display recent transactions"""
        st.subheader("📝 Recent Transactions")
        
        # Mock transaction data
        transactions = [
            {"date": "2024-01-15", "description": "Grocery Store", "amount": -85.50, "category": "Food & Dining"},
            {"date": "2024-01-14", "description": "Salary Deposit", "amount": 3500.00, "category": "Income"},
            {"date": "2024-01-13", "description": "Gas Station", "amount": -45.20, "category": "Transportation"},
            {"date": "2024-01-12", "description": "Netflix Subscription", "amount": -15.99, "category": "Entertainment"},
            {"date": "2024-01-11", "description": "Coffee Shop", "amount": -4.50, "category": "Food & Dining"},
        ]
        
        for transaction in transactions:
            col1, col2, col3 = st.columns([2, 3, 1])
            
            with col1:
                st.caption(transaction["date"])
            
            with col2:
                st.write(transaction["description"])
                st.caption(transaction["category"])
            
            with col3:
                color = "green" if transaction["amount"] > 0 else "red"
                st.markdown(f"<span style='color: {color}; font-weight: bold;'>${transaction['amount']:,.2f}</span>", unsafe_allow_html=True)
            
            st.markdown("---")
    
    def show_financial_insights(self):
        """Display AI-generated financial insights"""
        st.subheader("🧠 AI Financial Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.info("💡 **Spending Pattern Detected**\n\nYou're spending 15% more on dining this month compared to last month. Consider setting a weekly dining budget to control expenses.")
        
        with col2:
            st.success("🎯 **Savings Opportunity**\n\nYou could save an additional $200/month by reducing subscription services. Review your recurring payments.")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.warning("⚠️ **Budget Alert**\n\nYou're at 90% of your shopping budget. Consider waiting until next month for non-essential purchases.")
        
        with col2:
            st.success("📈 **Positive Trend**\n\nYour savings rate has improved by 5% this month! Keep up the great work with your financial goals.")
    
    def get_mock_financial_data(self):
        """Generate mock financial data for demonstration"""
        return {
            'total_balance': 12500.00,
            'balance_change': 850.00,
            'monthly_income': 4500.00,
            'income_change': 300.00,
            'monthly_expenses': 3200.00,
            'expense_change': -150.00,
            'savings_rate_change': 5.2
        } 