import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import re
import json

class ExpenseTracker:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.categories = [
            "Food & Dining", "Transportation", "Shopping", "Bills & Utilities",
            "Entertainment", "Healthcare", "Education", "Travel", "Insurance",
            "Investment", "Income", "Other"
        ]
        self.ml_model = self.load_ml_model()
        
    def show(self):
        st.title("💳 Expense & Income Tracker")
        st.markdown("---")
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "📝 Add Transaction", 
            "📊 View Transactions", 
            "📈 Analytics", 
            "🤖 AI Insights"
        ])
        
        with tab1:
            self.show_add_transaction()
        
        with tab2:
            self.show_transactions_view()
        
        with tab3:
            self.show_analytics()
        
        with tab4:
            self.show_ai_insights()
    
    def load_ml_model(self):
        """Load or create ML model for transaction categorization"""
        # In a real app, this would load a trained model
        # For demo, we'll create a simple rule-based + ML hybrid
        return {
            'vectorizer': TfidfVectorizer(max_features=1000, stop_words='english'),
            'classifier': MultinomialNB(),
            'trained': False
        }
    
    def predict_category(self, description, amount):
        """AI-powered category prediction using NLP and ML"""
        # Rule-based categorization first
        description_lower = description.lower()
        
        # Keywords for different categories
        category_keywords = {
            "Food & Dining": ["restaurant", "cafe", "coffee", "grocery", "food", "dining", "meal", "pizza", "burger"],
            "Transportation": ["gas", "fuel", "uber", "lyft", "taxi", "bus", "train", "parking", "toll"],
            "Shopping": ["amazon", "walmart", "target", "mall", "store", "shop", "clothing", "shoes"],
            "Bills & Utilities": ["electric", "water", "gas", "internet", "phone", "utility", "bill"],
            "Entertainment": ["netflix", "spotify", "movie", "theater", "concert", "game", "entertainment"],
            "Healthcare": ["doctor", "pharmacy", "medical", "dental", "health", "medicine"],
            "Education": ["tuition", "book", "course", "education", "school", "university"],
            "Travel": ["hotel", "flight", "airline", "vacation", "travel", "trip"],
            "Insurance": ["insurance", "premium", "coverage"],
            "Investment": ["stock", "investment", "portfolio", "fund", "broker"],
            "Income": ["salary", "deposit", "income", "payment", "refund"]
        }
        
        # Check for exact matches
        for category, keywords in category_keywords.items():
            if any(keyword in description_lower for keyword in keywords):
                return category
        
        # ML-based prediction (simplified for demo)
        # In real app, this would use a trained model
        if amount > 0:
            return "Income"
        elif "subscription" in description_lower or "monthly" in description_lower:
            return "Bills & Utilities"
        else:
            return "Other"
    
    def show_add_transaction(self):
        """Add new transaction with AI auto-categorization"""
        st.subheader("📝 Add New Transaction")
        
        col1, col2 = st.columns(2)
        
        with col1:
            with st.form("add_transaction"):
                # Transaction details
                transaction_type = st.selectbox(
                    "Transaction Type",
                    ["Expense", "Income"],
                    help="Select whether this is money going out (expense) or coming in (income)"
                )
                
                amount = st.number_input(
                    "Amount ($)",
                    min_value=0.01,
                    max_value=100000.00,
                    value=50.00,
                    step=0.01,
                    help="Enter the transaction amount"
                )
                
                description = st.text_input(
                    "Description",
                    placeholder="e.g., Grocery shopping at Walmart",
                    help="Describe the transaction. AI will auto-categorize based on this description."
                )
                
                date = st.date_input(
                    "Date",
                    value=datetime.now(),
                    help="Select the transaction date"
                )
                
                # AI auto-categorization
                if description:
                    predicted_category = self.predict_category(description, amount)
                    st.info(f"🤖 AI suggests category: **{predicted_category}**")
                
                category = st.selectbox(
                    "Category",
                    self.categories,
                    index=self.categories.index(predicted_category) if description else 0,
                    help="You can override the AI suggestion if needed"
                )
                
                # Additional fields
                payment_method = st.selectbox(
                    "Payment Method",
                    ["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Digital Wallet", "Other"]
                )
                
                tags = st.text_input(
                    "Tags (optional)",
                    placeholder="e.g., work, personal, emergency",
                    help="Add tags to help organize transactions"
                )
                
                notes = st.text_area(
                    "Notes (optional)",
                    placeholder="Any additional notes about this transaction...",
                    height=100
                )
                
                submitted = st.form_submit_button("💾 Save Transaction", use_container_width=True)
                
                if submitted:
                    if self.save_transaction(transaction_type, amount, description, date, 
                                          category, payment_method, tags, notes):
                        st.success("✅ Transaction saved successfully!")
                        st.balloons()
                    else:
                        st.error("❌ Failed to save transaction. Please try again.")
        
        with col2:
            st.subheader("🤖 AI Features")
            
            # Smart suggestions
            st.info("**Auto-Categorization**: AI analyzes your transaction description and suggests the most likely category.")
            
            st.info("**Smart Tags**: Based on your transaction history, AI can suggest relevant tags.")
            
            st.info("**Fraud Detection**: AI monitors for unusual spending patterns and alerts you to potential fraud.")
            
            st.info("**Budget Alerts**: AI tracks your spending against budgets and sends alerts when you're approaching limits.")
            
            # CSV Upload
            st.markdown("---")
            st.subheader("📁 Bulk Import")
            
            uploaded_file = st.file_uploader(
                "Upload CSV file",
                type=['csv'],
                help="Upload a CSV file with columns: Date, Description, Amount, Category"
            )
            
            if uploaded_file is not None:
                if st.button("📥 Import Transactions"):
                    self.import_csv_transactions(uploaded_file)
    
    def show_transactions_view(self):
        """View and manage transactions with AI-powered filtering"""
        st.subheader("📊 Transaction History")
        
        # Filters
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            date_range = st.selectbox(
                "Date Range",
                ["Last 7 days", "Last 30 days", "Last 3 months", "Last 6 months", "Last year", "All time"]
            )
        
        with col2:
            category_filter = st.multiselect(
                "Category",
                self.categories,
                default=self.categories[:5]
            )
        
        with col3:
            transaction_type_filter = st.multiselect(
                "Type",
                ["Expense", "Income"],
                default=["Expense", "Income"]
            )
        
        with col4:
            search_term = st.text_input(
                "Search",
                placeholder="Search transactions..."
            )
        
        # Get filtered transactions
        transactions = self.get_filtered_transactions(
            date_range, category_filter, transaction_type_filter, search_term
        )
        
        # Display transactions
        if transactions:
            # Summary metrics
            total_income = sum(t['amount'] for t in transactions if t['amount'] > 0)
            total_expenses = sum(t['amount'] for t in transactions if t['amount'] < 0)
            net_amount = total_income + total_expenses
            
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Total Income", f"${total_income:,.2f}")
            with col2:
                st.metric("Total Expenses", f"${abs(total_expenses):,.2f}")
            with col3:
                st.metric("Net Amount", f"${net_amount:,.2f}", 
                         delta_color="normal" if net_amount >= 0 else "inverse")
            
            # Transaction table
            st.markdown("### Recent Transactions")
            
            for transaction in transactions[:20]:  # Show last 20
                col1, col2, col3, col4, col5 = st.columns([2, 3, 2, 2, 1])
                
                with col1:
                    st.caption(transaction['date'].strftime("%Y-%m-%d"))
                
                with col2:
                    st.write(transaction['description'])
                    if transaction.get('tags'):
                        st.caption(f"Tags: {', '.join(transaction['tags'])}")
                
                with col3:
                    st.caption(transaction['category'])
                
                with col4:
                    st.caption(transaction['payment_method'])
                
                with col5:
                    color = "green" if transaction['amount'] > 0 else "red"
                    st.markdown(f"<span style='color: {color}; font-weight: bold;'>${transaction['amount']:,.2f}</span>", 
                               unsafe_allow_html=True)
                
                # Action buttons
                col1, col2, col3 = st.columns([1, 1, 1])
                with col1:
                    if st.button("✏️", key=f"edit_{transaction['id']}", help="Edit transaction"):
                        self.edit_transaction(transaction)
                with col2:
                    if st.button("🗑️", key=f"delete_{transaction['id']}", help="Delete transaction"):
                        self.delete_transaction(transaction['id'])
                with col3:
                    if st.button("🤖", key=f"ai_{transaction['id']}", help="AI analysis"):
                        self.show_ai_analysis(transaction)
                
                st.markdown("---")
        else:
            st.info("No transactions found matching your filters.")
    
    def show_analytics(self):
        """Show spending analytics with ML insights"""
        st.subheader("📈 Spending Analytics")
        
        # Get transaction data
        transactions = self.get_mock_transactions()  # In real app, get from DB
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Spending by category
            st.subheader("💳 Spending by Category")
            
            category_data = {}
            for transaction in transactions:
                if transaction['amount'] < 0:  # Only expenses
                    category = transaction['category']
                    amount = abs(transaction['amount'])
                    category_data[category] = category_data.get(category, 0) + amount
            
            if category_data:
                fig = px.pie(
                    values=list(category_data.values()),
                    names=list(category_data.keys()),
                    title="Monthly Spending Distribution"
                )
                st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Spending trend
            st.subheader("📈 Spending Trend")
            
            # Group by date
            daily_spending = {}
            for transaction in transactions:
                if transaction['amount'] < 0:
                    date = transaction['date'].strftime("%Y-%m-%d")
                    daily_spending[date] = daily_spending.get(date, 0) + abs(transaction['amount'])
            
            if daily_spending:
                dates = list(daily_spending.keys())
                amounts = list(daily_spending.values())
                
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=dates, y=amounts,
                    mode='lines+markers',
                    name='Daily Spending',
                    line=dict(color='#dc3545', width=3)
                ))
                
                fig.update_layout(
                    title="Daily Spending Trend",
                    xaxis_title="Date",
                    yaxis_title="Amount ($)",
                    height=400
                )
                
                st.plotly_chart(fig, use_container_width=True)
        
        # ML-powered insights
        st.subheader("🧠 ML-Powered Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Spending pattern analysis
            st.info("**Spending Pattern Detected**\n\nYour highest spending category is Food & Dining (32% of total expenses). Consider setting a weekly dining budget.")
            
            st.warning("**Unusual Spending Alert**\n\nYou spent 40% more on shopping this week compared to your average. Review if these purchases are necessary.")
        
        with col2:
            # Predictive insights
            st.success("**Savings Opportunity**\n\nBased on your spending patterns, you could save $150/month by reducing dining out frequency.")
            
            st.info("**Budget Recommendation**\n\nML suggests increasing your entertainment budget by 15% based on your consistent spending in this category.")
    
    def show_ai_insights(self):
        """Show AI-powered financial insights and recommendations"""
        st.subheader("🤖 AI Financial Assistant")
        
        # Chat interface for financial questions
        st.markdown("### 💬 Ask Your Financial Assistant")
        
        user_question = st.text_input(
            "Ask me anything about your finances...",
            placeholder="e.g., Where did most of my money go this month? Can I afford a $500 purchase?",
            help="Ask questions about your spending, savings, or financial goals"
        )
        
        if user_question:
            ai_response = self.generate_ai_response(user_question)
            st.markdown(f"**AI Response:** {ai_response}")
        
        # AI-generated insights
        st.markdown("### 📊 AI-Generated Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("🎯 Spending Recommendations")
            
            recommendations = [
                "Consider switching to a cheaper grocery store to save $50/month",
                "Your transportation costs are 20% higher than average. Consider carpooling or public transit",
                "You're spending 15% more on entertainment than last month. Review subscription services",
                "Your healthcare expenses are well below average. Great job maintaining health!",
                "Consider increasing your emergency fund contribution by $100/month"
            ]
            
            for i, rec in enumerate(recommendations):
                st.markdown(f"{i+1}. {rec}")
        
        with col2:
            st.subheader("📈 Predictive Analytics")
            
            predictions = [
                "Based on current trends, you'll save $2,400 by year-end",
                "Your dining expenses will increase by 8% next month (holiday season)",
                "You're on track to reach your emergency fund goal in 4 months",
                "Your investment portfolio could grow by 12% this year",
                "Consider increasing retirement contributions by 2%"
            ]
            
            for i, pred in enumerate(predictions):
                st.markdown(f"{i+1}. {pred}")
        
        # Anomaly detection
        st.markdown("### 🔍 Anomaly Detection")
        
        anomalies = [
            {"type": "Unusual Spending", "description": "You spent $200 more on shopping this week", "severity": "Medium"},
            {"type": "Income Drop", "description": "Your income was 15% lower this month", "severity": "High"},
            {"type": "Category Spike", "description": "Entertainment spending increased by 50%", "severity": "Low"}
        ]
        
        for anomaly in anomalies:
            color = {"High": "red", "Medium": "orange", "Low": "yellow"}[anomaly["severity"]]
            st.markdown(f"⚠️ **{anomaly['type']}**: {anomaly['description']} ({anomaly['severity']} priority)")
    
    def save_transaction(self, transaction_type, amount, description, date, 
                        category, payment_method, tags, notes):
        """Save transaction to database"""
        # In real app, save to Supabase
        # For demo, we'll just return success
        return True
    
    def get_filtered_transactions(self, date_range, categories, types, search_term):
        """Get filtered transactions from database"""
        # In real app, query Supabase
        # For demo, return mock data
        return self.get_mock_transactions()
    
    def get_mock_transactions(self):
        """Generate mock transaction data"""
        return [
            {
                'id': 1,
                'date': datetime.now() - timedelta(days=1),
                'description': 'Grocery shopping at Walmart',
                'amount': -85.50,
                'category': 'Food & Dining',
                'payment_method': 'Credit Card',
                'tags': ['personal', 'essential']
            },
            {
                'id': 2,
                'date': datetime.now() - timedelta(days=2),
                'description': 'Salary deposit',
                'amount': 3500.00,
                'category': 'Income',
                'payment_method': 'Bank Transfer',
                'tags': ['income', 'salary']
            },
            {
                'id': 3,
                'date': datetime.now() - timedelta(days=3),
                'description': 'Gas station',
                'amount': -45.20,
                'category': 'Transportation',
                'payment_method': 'Debit Card',
                'tags': ['transportation', 'fuel']
            }
        ]
    
    def generate_ai_response(self, question):
        """Generate AI response to financial questions"""
        # In real app, this would use OpenAI or Hugging Face
        responses = {
            "where did most of my money go": "Based on your spending data, most of your money went to Food & Dining (32%), followed by Transportation (25%) and Shopping (18%).",
            "can i afford": "Based on your current income and spending patterns, you have $1,200 available for discretionary spending this month.",
            "how much should i save": "Financial experts recommend saving 20% of your income. With your current income, you should aim to save $900/month.",
            "budget": "Your current budget allocation looks good, but consider reducing dining out expenses to increase your savings rate."
        }
        
        question_lower = question.lower()
        for key, response in responses.items():
            if key in question_lower:
                return response
        
        return "I can help you analyze your spending patterns, create budgets, and provide financial advice. Please ask a specific question about your finances."
    
    def import_csv_transactions(self, uploaded_file):
        """Import transactions from CSV file with AI auto-categorization"""
        try:
            df = pd.read_csv(uploaded_file)
            st.success(f"Successfully imported {len(df)} transactions!")
            
            # Show preview with AI categorization
            st.subheader("📋 Import Preview")
            
            for _, row in df.iterrows():
                predicted_category = self.predict_category(
                    str(row.get('Description', '')), 
                    float(row.get('Amount', 0))
                )
                st.write(f"{row.get('Date', 'N/A')} - {row.get('Description', 'N/A')} - ${row.get('Amount', 0):.2f} - {predicted_category}")
        
        except Exception as e:
            st.error(f"Error importing file: {str(e)}")
    
    def edit_transaction(self, transaction):
        """Edit transaction"""
        st.info(f"Edit transaction: {transaction['description']}")
        # In real app, show edit form
    
    def delete_transaction(self, transaction_id):
        """Delete transaction"""
        st.success(f"Transaction {transaction_id} deleted successfully!")
        # In real app, delete from database
    
    def show_ai_analysis(self, transaction):
        """Show AI analysis of specific transaction"""
        st.info(f"AI Analysis for: {transaction['description']}")
        
        analysis = f"""
        **Transaction Analysis:**
        - Category: {transaction['category']} (AI confidence: 95%)
        - Spending pattern: This is a typical {transaction['category'].lower()} expense
        - Budget impact: ${abs(transaction['amount']):.2f} ({(abs(transaction['amount'])/3200)*100:.1f}% of monthly budget)
        - Recommendation: This transaction aligns with your normal spending patterns
        """
        
        st.markdown(analysis) 