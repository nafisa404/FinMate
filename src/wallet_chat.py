import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from transformers import pipeline
import re
import json

class WalletChat:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.chat_history = []
        self.financial_data = self.get_mock_financial_data()
        self.nlp_processor = self.initialize_nlp()
        
    def show(self):
        st.title("🤖 Wallet Chat Assistant")
        st.markdown("---")
        
        # Chat overview
        self.show_chat_overview()
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "💬 Chat Interface", 
            "⚡ Quick Actions", 
            "📊 Chat Insights", 
            "🎯 Smart Suggestions"
        ])
        
        with tab1:
            self.show_chat_interface()
        
        with tab2:
            self.show_quick_actions()
        
        with tab3:
            self.show_chat_insights()
        
        with tab4:
            self.show_smart_suggestions()
    
    def initialize_nlp(self):
        """Initialize NLP components for chat processing"""
        return {
            'intent_classifier': None,  # Would be pipeline("text-classification")
            'entity_extractor': None,   # Would be pipeline("token-classification")
            'sentiment_analyzer': None  # Would be pipeline("sentiment-analysis")
        }
    
    def show_chat_overview(self):
        """Display chat overview metrics"""
        st.subheader("📊 Chat Overview")
        
        # Calculate chat metrics
        total_messages = len(self.chat_history)
        ai_responses = len([msg for msg in self.chat_history if msg['sender'] == 'AI'])
        user_messages = len([msg for msg in self.chat_history if msg['sender'] == 'User'])
        avg_response_time = self.calculate_avg_response_time()
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="💬 Total Messages",
                value=total_messages,
                delta=f"+{user_messages} today",
                delta_color="normal"
            )
        
        with col2:
            st.metric(
                label="🤖 AI Responses",
                value=ai_responses,
                delta=f"{ai_responses/total_messages*100:.1f}%",
                delta_color="normal"
            )
        
        with col3:
            st.metric(
                label="⏱️ Avg Response Time",
                value=f"{avg_response_time:.1f}s",
                delta="-0.5s",
                delta_color="normal"
            )
        
        with col4:
            st.metric(
                label="🎯 Accuracy",
                value="95.2%",
                delta="+2.1%",
                delta_color="normal"
            )
    
    def show_chat_interface(self):
        """Show main chat interface"""
        st.subheader("💬 Chat with Your Financial Assistant")
        
        # Chat container
        chat_container = st.container()
        
        with chat_container:
            # Display chat history
            for message in self.chat_history:
                if message['sender'] == 'User':
                    with st.chat_message("user"):
                        st.write(message['content'])
                else:
                    with st.chat_message("assistant"):
                        st.write(message['content'])
        
        # Chat input
        user_input = st.chat_input("Ask me anything about your finances...")
        
        if user_input:
            # Add user message to history
            self.chat_history.append({
                'sender': 'User',
                'content': user_input,
                'timestamp': datetime.now()
            })
            
            # Generate AI response
            ai_response = self.generate_ai_response(user_input)
            
            # Add AI response to history
            self.chat_history.append({
                'sender': 'AI',
                'content': ai_response,
                'timestamp': datetime.now()
            })
            
            # Rerun to update chat display
            st.rerun()
    
    def show_quick_actions(self):
        """Show quick action buttons"""
        st.subheader("⚡ Quick Actions")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 💰 Financial Queries")
            
            if st.button("📊 Show Spending Summary", use_container_width=True):
                self.handle_quick_action("spending_summary")
            
            if st.button("💰 Check Budget Status", use_container_width=True):
                self.handle_quick_action("budget_status")
            
            if st.button("💸 Analyze Expenses", use_container_width=True):
                self.handle_quick_action("expense_analysis")
            
            if st.button("🎯 Review Goals", use_container_width=True):
                self.handle_quick_action("goal_review")
        
        with col2:
            st.markdown("### 📈 Investment Queries")
            
            if st.button("📈 Portfolio Status", use_container_width=True):
                self.handle_quick_action("portfolio_status")
            
            if st.button("📊 Market Analysis", use_container_width=True):
                self.handle_quick_action("market_analysis")
            
            if st.button("💡 Investment Tips", use_container_width=True):
                self.handle_quick_action("investment_tips")
            
            if st.button("🎯 Risk Assessment", use_container_width=True):
                self.handle_quick_action("risk_assessment")
        
        # Recent queries
        st.markdown("### 🔍 Recent Queries")
        recent_queries = [
            "How much did I spend on food this month?",
            "What's my current savings rate?",
            "Should I invest in index funds?",
            "How can I reduce my expenses?",
            "What's the best way to save for retirement?"
        ]
        
        for query in recent_queries:
            if st.button(f"🔍 {query}", key=f"recent_{query}", use_container_width=True):
                self.handle_quick_action("custom_query", query)
    
    def show_chat_insights(self):
        """Show chat analytics and insights"""
        st.subheader("📊 Chat Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Message volume over time
            st.markdown("### 📈 Message Volume")
            
            message_data = self.get_message_volume_data()
            
            fig = go.Figure()
            
            fig.add_trace(go.Scatter(
                x=message_data['dates'],
                y=message_data['user_messages'],
                mode='lines+markers',
                name='User Messages',
                line=dict(color='#1f77b4', width=3)
            ))
            
            fig.add_trace(go.Scatter(
                x=message_data['dates'],
                y=message_data['ai_responses'],
                mode='lines+markers',
                name='AI Responses',
                line=dict(color='#ff7f0e', width=3)
            ))
            
            fig.update_layout(
                title="Daily Message Volume",
                xaxis_title="Date",
                yaxis_title="Number of Messages",
                height=400
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Query categories
            st.markdown("### 🎯 Query Categories")
            
            category_data = self.get_query_category_data()
            
            fig = px.pie(
                category_data,
                values='count',
                names='category',
                title="Query Categories Distribution"
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        # Chat sentiment analysis
        st.markdown("### 😊 Sentiment Analysis")
        
        sentiment_data = self.get_sentiment_data()
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                "Positive Queries",
                f"{sentiment_data['positive']}",
                f"{sentiment_data['positive_pct']:.1f}%"
            )
        
        with col2:
            st.metric(
                "Neutral Queries",
                f"{sentiment_data['neutral']}",
                f"{sentiment_data['neutral_pct']:.1f}%"
            )
        
        with col3:
            st.metric(
                "Negative Queries",
                f"{sentiment_data['negative']}",
                f"{sentiment_data['negative_pct']:.1f}%"
            )
    
    def show_smart_suggestions(self):
        """Show smart suggestions based on chat patterns"""
        st.subheader("🎯 Smart Suggestions")
        
        # Personalized suggestions
        suggestions = self.generate_smart_suggestions()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 💡 Based on Your Queries")
            
            for suggestion in suggestions['query_based']:
                with st.expander(f"💡 {suggestion['title']}"):
                    st.markdown(suggestion['description'])
                    if st.button(f"Ask: {suggestion['question']}", key=f"suggest_{suggestion['id']}"):
                        self.handle_quick_action("custom_query", suggestion['question'])
        
        with col2:
            st.markdown("### 🧠 AI Recommendations")
            
            for rec in suggestions['ai_recommendations']:
                with st.expander(f"🤖 {rec['title']}"):
                    st.markdown(rec['description'])
                    st.markdown(f"**Confidence:** {rec['confidence']}%")
                    if st.button("Learn More", key=f"rec_{rec['id']}"):
                        self.handle_quick_action("custom_query", rec['question'])
        
        # Trending topics
        st.markdown("### 🔥 Trending Topics")
        
        trending_topics = [
            "Emergency fund optimization",
            "Investment diversification",
            "Tax-efficient saving",
            "Retirement planning",
            "Debt payoff strategies"
        ]
        
        for topic in trending_topics:
            if st.button(f"🔥 {topic}", key=f"trend_{topic}", use_container_width=True):
                self.handle_quick_action("custom_query", f"Tell me about {topic}")
    
    def generate_ai_response(self, user_input: str) -> str:
        """Generate AI response based on user input"""
        # Classify intent
        intent = self.classify_intent(user_input)
        
        # Extract entities
        entities = self.extract_entities(user_input)
        
        # Generate response based on intent
        if intent == 'spending_query':
            return self.generate_spending_response(user_input, entities)
        elif intent == 'budget_query':
            return self.generate_budget_response(user_input, entities)
        elif intent == 'savings_query':
            return self.generate_savings_response(user_input, entities)
        elif intent == 'investment_query':
            return self.generate_investment_response(user_input, entities)
        elif intent == 'advice_query':
            return self.generate_advice_response(user_input, entities)
        else:
            return self.generate_general_response(user_input)
    
    def classify_intent(self, text: str) -> str:
        """Classify user intent using NLP"""
        text_lower = text.lower()
        
        spending_keywords = ['spend', 'expense', 'cost', 'payment', 'bill', 'purchase']
        budget_keywords = ['budget', 'limit', 'plan', 'allocate']
        savings_keywords = ['save', 'saving', 'emergency', 'fund']
        investment_keywords = ['invest', 'investment', 'portfolio', 'stock', 'fund']
        advice_keywords = ['advice', 'recommend', 'suggest', 'help', 'how']
        
        if any(keyword in text_lower for keyword in spending_keywords):
            return 'spending_query'
        elif any(keyword in text_lower for keyword in budget_keywords):
            return 'budget_query'
        elif any(keyword in text_lower for keyword in savings_keywords):
            return 'savings_query'
        elif any(keyword in text_lower for keyword in investment_keywords):
            return 'investment_query'
        elif any(keyword in text_lower for keyword in advice_keywords):
            return 'advice_query'
        else:
            return 'general_query'
    
    def extract_entities(self, text: str) -> dict:
        """Extract entities from user input"""
        entities = {
            'amount': None,
            'category': None,
            'time_period': None,
            'currency': 'USD'
        }
        
        # Extract amount
        amount_pattern = r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)'
        amount_match = re.search(amount_pattern, text)
        if amount_match:
            entities['amount'] = float(amount_match.group(1).replace(',', ''))
        
        # Extract category
        categories = ['food', 'transportation', 'shopping', 'bills', 'entertainment', 'healthcare']
        for category in categories:
            if category in text.lower():
                entities['category'] = category
                break
        
        # Extract time period
        time_patterns = {
            'this month': 'current_month',
            'last month': 'previous_month',
            'this year': 'current_year',
            'last year': 'previous_year',
            'today': 'today',
            'yesterday': 'yesterday'
        }
        
        for pattern, period in time_patterns.items():
            if pattern in text.lower():
                entities['time_period'] = period
                break
        
        return entities
    
    def generate_spending_response(self, query: str, entities: dict) -> str:
        """Generate response for spending-related queries"""
        if entities.get('category'):
            return f"Based on your spending data, you've spent ${self.get_category_spending(entities['category']):,.2f} on {entities['category']} this month. This represents {self.get_category_percentage(entities['category']):.1f}% of your total expenses."
        elif entities.get('amount'):
            return f"I can help you track spending around ${entities['amount']:,.2f}. Would you like me to show you transactions in that range or help you set a budget limit?"
        else:
            return "I can help you analyze your spending patterns. Would you like to see your spending by category, track specific expenses, or get recommendations for reducing costs?"
    
    def generate_budget_response(self, query: str, entities: dict) -> str:
        """Generate response for budget-related queries"""
        budget_status = self.analyze_budget_status()
        
        if budget_status['status'] == 'on_track':
            return f"Great news! You're on track with your budget. You've used {budget_status['percentage']:.1f}% of your monthly budget, with ${budget_status['remaining']:,.2f} remaining."
        elif budget_status['status'] == 'over_budget':
            return f"⚠️ You're currently over budget by ${budget_status['overage']:,.2f}. Consider reviewing your spending in {budget_status['problem_categories']} to get back on track."
        else:
            return f"You're doing well with your budget! You've used {budget_status['percentage']:.1f}% of your monthly budget and are on pace to stay within your limits."
    
    def generate_savings_response(self, query: str, entities: dict) -> str:
        """Generate response for savings-related queries"""
        savings_data = self.get_savings_data()
        
        return f"Your current savings rate is {savings_data['rate']:.1f}%, which is {'above' if savings_data['rate'] > 20 else 'below'} the recommended 20%. You've saved ${savings_data['amount']:,.2f} this month. {'Great job!' if savings_data['rate'] > 20 else 'Consider increasing your savings rate.'}"
    
    def generate_investment_response(self, query: str, entities: dict) -> str:
        """Generate response for investment-related queries"""
        portfolio_data = self.get_portfolio_data()
        
        return f"Your investment portfolio is currently valued at ${portfolio_data['value']:,.2f} with a {portfolio_data['return']:+.1f}% return this year. Your portfolio is {'well-diversified' if portfolio_data['diversification'] > 0.7 else 'could benefit from more diversification'}."
    
    def generate_advice_response(self, query: str, entities: dict) -> str:
        """Generate response for advice-related queries"""
        return "Based on your financial profile, I'd recommend focusing on building your emergency fund first, then diversifying your investments. Would you like specific advice on any particular area?"
    
    def generate_general_response(self, query: str) -> str:
        """Generate general response"""
        return "I'm here to help with your financial questions! You can ask me about your spending, budget, savings, investments, or get personalized financial advice. What would you like to know?"
    
    def handle_quick_action(self, action: str, custom_query: str = None):
        """Handle quick action button clicks"""
        if action == "spending_summary":
            response = "Here's your spending summary for this month:\n\n" + self.get_spending_summary()
        elif action == "budget_status":
            response = self.generate_budget_response("budget status", {})
        elif action == "expense_analysis":
            response = "Let me analyze your expenses:\n\n" + self.get_expense_analysis()
        elif action == "goal_review":
            response = "Here's a review of your financial goals:\n\n" + self.get_goal_review()
        elif action == "custom_query":
            response = self.generate_ai_response(custom_query)
        else:
            response = "I can help you with that! What specific information would you like?"
        
        # Add to chat history
        self.chat_history.append({
            'sender': 'User',
            'content': f"Quick action: {action}",
            'timestamp': datetime.now()
        })
        
        self.chat_history.append({
            'sender': 'AI',
            'content': response,
            'timestamp': datetime.now()
        })
        
        st.rerun()
    
    def calculate_avg_response_time(self) -> float:
        """Calculate average response time"""
        return 1.2  # Mock data
    
    def get_message_volume_data(self) -> dict:
        """Get message volume data for visualization"""
        dates = pd.date_range(start='2024-01-01', end='2024-01-31', freq='D')
        
        return {
            'dates': dates,
            'user_messages': [np.random.randint(0, 10) for _ in dates],
            'ai_responses': [np.random.randint(0, 10) for _ in dates]
        }
    
    def get_query_category_data(self) -> pd.DataFrame:
        """Get query category data"""
        return pd.DataFrame({
            'category': ['Spending', 'Budget', 'Savings', 'Investment', 'Advice'],
            'count': [25, 20, 15, 18, 12]
        })
    
    def get_sentiment_data(self) -> dict:
        """Get sentiment analysis data"""
        total = 90
        positive = 45
        neutral = 35
        negative = 10
        
        return {
            'positive': positive,
            'neutral': neutral,
            'negative': negative,
            'positive_pct': (positive / total) * 100,
            'neutral_pct': (neutral / total) * 100,
            'negative_pct': (negative / total) * 100
        }
    
    def generate_smart_suggestions(self) -> dict:
        """Generate smart suggestions based on user patterns"""
        return {
            'query_based': [
                {
                    'id': 1,
                    'title': 'Spending Pattern Analysis',
                    'description': 'You frequently ask about food expenses. Let me analyze your dining patterns.',
                    'question': 'How can I reduce my dining expenses?'
                },
                {
                    'id': 2,
                    'title': 'Budget Optimization',
                    'description': 'Based on your queries, you might benefit from budget optimization.',
                    'question': 'What's the best way to optimize my budget?'
                }
            ],
            'ai_recommendations': [
                {
                    'id': 1,
                    'title': 'Emergency Fund Boost',
                    'description': 'Your emergency fund is below recommended levels. Consider increasing contributions.',
                    'confidence': 85,
                    'question': 'How much should I have in my emergency fund?'
                },
                {
                    'id': 2,
                    'title': 'Investment Diversification',
                    'description': 'Your portfolio could benefit from more diversification.',
                    'confidence': 78,
                    'question': 'How can I diversify my investments?'
                }
            ]
        }
    
    def get_category_spending(self, category: str) -> float:
        """Get spending for a specific category"""
        category_totals = {
            'food': 450.0,
            'transportation': 200.0,
            'shopping': 300.0,
            'bills': 800.0,
            'entertainment': 150.0,
            'healthcare': 100.0
        }
        return category_totals.get(category, 0.0)
    
    def get_category_percentage(self, category: str) -> float:
        """Get percentage of total spending for a category"""
        category_percentages = {
            'food': 22.5,
            'transportation': 10.0,
            'shopping': 15.0,
            'bills': 40.0,
            'entertainment': 7.5,
            'healthcare': 5.0
        }
        return category_percentages.get(category, 0.0)
    
    def analyze_budget_status(self) -> dict:
        """Analyze current budget status"""
        return {
            'status': 'on_track',
            'percentage': 65.0,
            'remaining': 1400.0,
            'overage': 0.0,
            'problem_categories': ['dining', 'entertainment']
        }
    
    def get_savings_data(self) -> dict:
        """Get savings data"""
        return {
            'rate': 18.5,
            'amount': 925.0
        }
    
    def get_portfolio_data(self) -> dict:
        """Get portfolio data"""
        return {
            'value': 25000.0,
            'return': 8.5,
            'diversification': 0.75
        }
    
    def get_spending_summary(self) -> str:
        """Get spending summary"""
        return """• Total spending: $2,000
• Top category: Bills & Utilities ($800)
• Savings rate: 18.5%
• Budget status: On track"""
    
    def get_expense_analysis(self) -> str:
        """Get expense analysis"""
        return """• Dining expenses are 20% above average
• Transportation costs are well-controlled
• Consider reducing entertainment spending
• Healthcare expenses are within normal range"""
    
    def get_goal_review(self) -> str:
        """Get goal review"""
        return """• Emergency fund: 75% complete
• Retirement savings: On track
• Debt payoff: Ahead of schedule
• Investment goals: Meeting targets"""
    
    def get_mock_financial_data(self) -> dict:
        """Get mock financial data"""
        return {
            'total_income': 5000,
            'total_expenses': 3000,
            'savings_rate': 40,
            'emergency_fund': 8000,
            'investment_portfolio': 25000
        }                }  
 