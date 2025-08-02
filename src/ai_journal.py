import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from transformers import pipeline
import json

class AIJournal:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.journal_entries = self.get_journal_entries()
        self.nlp_processor = self.initialize_nlp()
        
    def show(self):
        st.title("📝 AI Financial Journal")
        st.markdown("---")
        
        # Journal overview
        self.show_journal_overview()
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "📖 Journal Entries", 
            "🤖 AI Summaries", 
            "📊 Sentiment Analysis", 
            "💡 AI Insights"
        ])
        
        with tab1:
            self.show_journal_entries()
        
        with tab2:
            self.show_ai_summaries()
        
        with tab3:
            self.show_sentiment_analysis()
        
        with tab4:
            self.show_ai_insights()
    
    def initialize_nlp(self):
        """Initialize NLP components for journal analysis"""
        return {
            'sentiment_analyzer': None,  # Would be pipeline("sentiment-analysis")
            'text_generator': None,      # Would be pipeline("text-generation")
            'summarizer': None           # Would be pipeline("summarization")
        }
    
    def show_journal_overview(self):
        """Display journal overview metrics"""
        st.subheader("📊 Journal Overview")
        
        # Calculate journal metrics
        total_entries = len(self.journal_entries)
        monthly_entries = len([e for e in self.journal_entries if e['date'].month == datetime.now().month])
        avg_sentiment = self.calculate_average_sentiment()
        ai_generated = len([e for e in self.journal_entries if e['ai_generated']])
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="📝 Total Entries",
                value=total_entries,
                delta=f"+{monthly_entries} this month",
                delta_color="normal"
            )
        
        with col2:
            st.metric(
                label="😊 Average Sentiment",
                value=f"{avg_sentiment:.1f}/10",
                delta="+0.5 points",
                delta_color="normal"
            )
        
        with col3:
            st.metric(
                label="🤖 AI Generated",
                value=f"{ai_generated}",
                delta=f"{ai_generated/total_entries*100:.1f}%",
                delta_color="normal"
            )
        
        with col4:
            st.metric(
                label="📈 Writing Streak",
                value="7 days",
                delta="+2 days",
                delta_color="normal"
            )
    
    def show_journal_entries(self):
        """Show journal entries with AI analysis"""
        st.subheader("📖 Journal Entries")
        
        # Add new entry
        with st.expander("✍️ Add New Entry"):
            self.show_add_entry_form()
        
        # Display entries
        for entry in self.journal_entries:
            with st.expander(f"{entry['date'].strftime('%Y-%m-%d')} - {entry['title']}"):
                col1, col2 = st.columns([3, 1])
                
                with col1:
                    st.markdown(f"**{entry['title']}**")
                    st.markdown(entry['content'])
                    
                    if entry.get('tags'):
                        st.markdown(f"**Tags:** {', '.join(entry['tags'])}")
                    
                    if entry.get('financial_impact'):
                        st.markdown(f"**Financial Impact:** {entry['financial_impact']}")
                
                with col2:
                    # Sentiment indicator
                    sentiment_score = entry.get('sentiment_score', 5)
                    sentiment_color = self.get_sentiment_color(sentiment_score)
                    st.markdown(f"**Sentiment:** <span style='color: {sentiment_color};'>{sentiment_score}/10</span>", unsafe_allow_html=True)
                    
                    if entry['ai_generated']:
                        st.success("🤖 AI Generated")
                    
                    # Entry actions
                    col1, col2 = st.columns(2)
                    with col1:
                        if st.button("✏️ Edit", key=f"edit_{entry['id']}"):
                            self.edit_entry(entry)
                    with col2:
                        if st.button("🗑️ Delete", key=f"delete_{entry['id']}"):
                            self.delete_entry(entry['id'])
    
    def show_ai_summaries(self):
        """Show AI-generated summaries and insights"""
        st.subheader("🤖 AI-Generated Summaries")
        
        # Monthly summary
        monthly_summary = self.generate_monthly_summary()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 📅 Monthly Summary")
            st.info(monthly_summary['content'])
            
            st.markdown("**Key Highlights:**")
            for highlight in monthly_summary['highlights']:
                st.markdown(f"• {highlight}")
        
        with col2:
            st.markdown("### 🎯 Financial Insights")
            
            insights = monthly_summary['insights']
            for insight in insights:
                st.success(insight)
        
        # AI-generated recommendations
        st.markdown("### 💡 AI Recommendations")
        
        recommendations = self.generate_ai_recommendations()
        
        for rec in recommendations:
            with st.expander(f"{rec['title']} - {rec['priority']}"):
                st.markdown(f"**Description:** {rec['description']}")
                st.markdown(f"**Reasoning:** {rec['reasoning']}")
                st.markdown(f"**Expected Impact:** {rec['expected_impact']}")
    
    def show_sentiment_analysis(self):
        """Show sentiment analysis and trends"""
        st.subheader("📊 Sentiment Analysis")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Sentiment over time
            st.markdown("### 📈 Sentiment Trends")
            
            sentiment_data = self.get_sentiment_data()
            
            fig = go.Figure()
            
            fig.add_trace(go.Scatter(
                x=sentiment_data['dates'],
                y=sentiment_data['scores'],
                mode='lines+markers',
                name='Sentiment Score',
                line=dict(color='#1f77b4', width=3)
            ))
            
            fig.update_layout(
                title="Sentiment Over Time",
                xaxis_title="Date",
                yaxis_title="Sentiment Score",
                height=400
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Sentiment distribution
            st.markdown("### 📊 Sentiment Distribution")
            
            sentiment_dist = self.get_sentiment_distribution()
            
            fig = px.pie(
                values=list(sentiment_dist.values()),
                names=list(sentiment_dist.keys()),
                title="Sentiment Distribution",
                color_discrete_sequence=['#28a745', '#ffc107', '#dc3545']
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        # Sentiment insights
        st.markdown("### 🧠 Sentiment Insights")
        
        insights = [
            "Your sentiment is generally positive, indicating good financial well-being",
            "Negative sentiment often correlates with unexpected expenses",
            "Positive sentiment peaks after achieving financial goals",
            "Consider journaling more during stressful financial periods"
        ]
        
        for insight in insights:
            st.info(insight)
    
    def show_ai_insights(self):
        """Show AI-powered insights from journal entries"""
        st.subheader("💡 AI-Powered Insights")
        
        # Pattern recognition
        patterns = self.identify_patterns()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🔍 Pattern Recognition")
            
            for pattern in patterns['behavioral']:
                st.markdown(f"**{pattern['title']}**")
                st.markdown(f"{pattern['description']}")
                st.markdown(f"*Confidence: {pattern['confidence']}%*")
                st.markdown("---")
        
        with col2:
            st.markdown("### 🎯 Behavioral Insights")
            
            for insight in patterns['insights']:
                st.success(insight)
        
        # Predictive analysis
        st.markdown("### 🔮 Predictive Analysis")
        
        predictions = self.generate_predictions()
        
        for prediction in predictions:
            with st.expander(f"{prediction['title']} - {prediction['probability']}% likely"):
                st.markdown(f"**Description:** {prediction['description']}")
                st.markdown(f"**Based on:** {prediction['evidence']}")
                st.markdown(f"**Recommendation:** {prediction['recommendation']}")
    
    def show_add_entry_form(self):
        """Show form to add new journal entry"""
        with st.form("add_journal_entry"):
            title = st.text_input("Title", placeholder="e.g., Monthly Budget Review")
            
            content = st.text_area(
                "Content",
                placeholder="Write about your financial thoughts, goals, or experiences...",
                height=200
            )
            
            tags = st.text_input("Tags (optional)", placeholder="e.g., budget, goals, investment")
            
            financial_impact = st.selectbox(
                "Financial Impact",
                ["Positive", "Neutral", "Negative"],
                help="How did this affect your finances?"
            )
            
            submitted = st.form_submit_button("💾 Save Entry", use_container_width=True)
            
            if submitted and title and content:
                if self.save_journal_entry(title, content, tags, financial_impact):
                    st.success("✅ Journal entry saved successfully!")
                    st.balloons()
                else:
                    st.error("❌ Failed to save entry. Please try again.")
    
    def get_sentiment_color(self, score):
        """Get color for sentiment score"""
        if score >= 7:
            return "green"
        elif score >= 4:
            return "orange"
        else:
            return "red"
    
    def calculate_average_sentiment(self):
        """Calculate average sentiment score"""
        scores = [entry.get('sentiment_score', 5) for entry in self.journal_entries]
        return np.mean(scores) if scores else 5.0
    
    def generate_monthly_summary(self):
        """Generate AI-powered monthly summary"""
        return {
            'content': "This month, you showed strong financial discipline with consistent savings and reduced impulse spending. Your emergency fund grew by 15%, and you made progress toward your investment goals. However, dining expenses were higher than usual, which may need attention.",
            'highlights': [
                "Emergency fund increased by 15%",
                "Reduced impulse spending by 25%",
                "Made progress on investment goals",
                "Dining expenses 20% above average"
            ],
            'insights': [
                "Your budgeting discipline is improving",
                "Consider setting dining budget limits",
                "Investment contributions are on track",
                "Emergency fund growth is excellent"
            ]
        }
    
    def generate_ai_recommendations(self):
        """Generate AI recommendations based on journal entries"""
        return [
            {
                'title': 'Set Dining Budget',
                'priority': 'High',
                'description': 'Create a monthly dining budget to control social spending',
                'reasoning': 'Your journal shows consistent overspending on dining',
                'expected_impact': 'Reduce monthly expenses by $200'
            },
            {
                'title': 'Increase Investment Contributions',
                'priority': 'Medium',
                'description': 'Consider increasing monthly investment contributions',
                'reasoning': 'Your emergency fund is well-funded and you have excess savings',
                'expected_impact': 'Accelerate wealth building by 2 years'
            },
            {
                'title': 'Review Subscription Services',
                'priority': 'Low',
                'description': 'Audit your subscription services for unused memberships',
                'reasoning': 'You mentioned unused services in recent entries',
                'expected_impact': 'Save $50-100 monthly'
            }
        ]
    
    def get_sentiment_data(self):
        """Get sentiment data for visualization"""
        dates = [entry['date'] for entry in self.journal_entries]
        scores = [entry.get('sentiment_score', 5) for entry in self.journal_entries]
        
        return {
            'dates': dates,
            'scores': scores
        }
    
    def get_sentiment_distribution(self):
        """Get sentiment distribution"""
        scores = [entry.get('sentiment_score', 5) for entry in self.journal_entries]
        
        positive = len([s for s in scores if s >= 7])
        neutral = len([s for s in scores if 4 <= s < 7])
        negative = len([s for s in scores if s < 4])
        
        return {
            'Positive': positive,
            'Neutral': neutral,
            'Negative': negative
        }
    
    def identify_patterns(self):
        """Identify patterns in journal entries using AI"""
        return {
            'behavioral': [
                {
                    'title': 'Goal-Oriented Spending',
                    'description': 'You consistently prioritize spending that aligns with your financial goals',
                    'confidence': 85
                },
                {
                    'title': 'Social Spending Influence',
                    'description': 'Your spending increases during social events and peer interactions',
                    'confidence': 78
                },
                {
                    'title': 'Stress-Induced Spending',
                    'description': 'You tend to spend more during stressful periods',
                    'confidence': 65
                }
            ],
            'insights': [
                "Your goal-oriented behavior is strong - leverage this for better financial planning",
                "Consider setting social spending limits to maintain budget discipline",
                "Develop stress-management strategies that don't involve spending",
                "Your journaling habit correlates with better financial decisions"
            ]
        }
    
    def generate_predictions(self):
        """Generate predictions based on journal patterns"""
        return [
            {
                'title': 'Increased Savings Rate',
                'probability': 85,
                'description': 'You will increase your savings rate by 10% in the next 3 months',
                'evidence': 'Consistent positive sentiment and goal-oriented entries',
                'recommendation': 'Set up automatic savings transfers to capitalize on this momentum'
            },
            {
                'title': 'Investment Portfolio Growth',
                'probability': 75,
                'description': 'Your investment portfolio will grow by 15% this year',
                'evidence': 'Regular investment contributions and positive market sentiment',
                'recommendation': 'Consider increasing contribution amounts gradually'
            },
            {
                'title': 'Emergency Fund Completion',
                'probability': 90,
                'description': 'You will reach your emergency fund goal within 2 months',
                'evidence': 'Consistent monthly contributions and strong saving discipline',
                'recommendation': 'Plan for what to do with excess savings once goal is reached'
            }
        ]
    
    def save_journal_entry(self, title, content, tags, financial_impact):
        """Save journal entry to database"""
        # In real app, save to Supabase
        # For demo, we'll just return success
        return True
    
    def edit_entry(self, entry):
        """Edit journal entry"""
        st.info(f"Edit entry: {entry['title']}")
        # In real app, show edit form
    
    def delete_entry(self, entry_id):
        """Delete journal entry"""
        st.success(f"Entry {entry_id} deleted successfully!")
        # In real app, delete from database
    
    def get_journal_entries(self):
        """Get journal entries"""
        return [
            {
                'id': 1,
                'title': 'Monthly Budget Review',
                'content': 'This month went well overall. I stayed within my budget for most categories, but dining expenses were higher than expected. I need to be more mindful of social spending. On the positive side, my emergency fund grew by $500 and I made my first investment contribution.',
                'date': datetime.now() - timedelta(days=5),
                'sentiment_score': 7.5,
                'ai_generated': False,
                'tags': ['budget', 'review', 'emergency-fund'],
                'financial_impact': 'Positive'
            },
            {
                'id': 2,
                'title': 'Investment Decision',
                'content': 'Finally decided to start investing! I opened a Roth IRA and contributed $500. It feels good to take this step toward long-term financial security. I chose a target-date fund to keep it simple.',
                'date': datetime.now() - timedelta(days=10),
                'sentiment_score': 8.5,
                'ai_generated': False,
                'tags': ['investment', 'roth-ira', 'long-term'],
                'financial_impact': 'Positive'
            },
            {
                'id': 3,
                'title': 'Unexpected Car Repair',
                'content': 'Had to pay $800 for car repairs this week. This was unexpected and stressful, but I was able to cover it from my emergency fund without going into debt. This really showed me the importance of having savings.',
                'date': datetime.now() - timedelta(days=15),
                'sentiment_score': 6.0,
                'ai_generated': False,
                'tags': ['emergency', 'car-repair', 'savings'],
                'financial_impact': 'Neutral'
            },
            {
                'id': 4,
                'title': 'AI-Generated Monthly Summary',
                'content': 'Based on your financial data, you had a successful month with strong savings and good budget discipline. Your emergency fund is growing well, and you made progress on your investment goals. Consider setting dining budget limits to control social spending.',
                'date': datetime.now() - timedelta(days=1),
                'sentiment_score': 7.8,
                'ai_generated': True,
                'tags': ['ai-summary', 'monthly-review'],
                'financial_impact': 'Positive'
            }
        ] 