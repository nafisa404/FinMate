import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import json

class PersonalityProfiler:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.personality_data = self.get_personality_data()
        self.ml_model = self.initialize_ml_model()
        
    def show(self):
        st.title("🧠 Financial Personality Profiler")
        st.markdown("---")
        
        # Personality overview
        self.show_personality_overview()
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "📊 Personality Analysis", 
            "🤖 AI Insights", 
            "🎯 Personalized Recommendations", 
            "📈 Behavioral Patterns"
        ])
        
        with tab1:
            self.show_personality_analysis()
        
        with tab2:
            self.show_ai_insights()
        
        with tab3:
            self.show_personalized_recommendations()
        
        with tab4:
            self.show_behavioral_patterns()
    
    def initialize_ml_model(self):
        """Initialize ML model for personality clustering"""
        return {
            'clustering_model': KMeans(n_clusters=4, random_state=42),
            'pca_model': PCA(n_components=2),
            'scaler': StandardScaler()
        }
    
    def show_personality_overview(self):
        """Display personality overview metrics"""
        st.subheader("📊 Your Financial Personality")
        
        # Get user personality type
        personality_type = self.get_personality_type()
        confidence_score = self.calculate_confidence_score()
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="🎭 Personality Type",
                value=personality_type['name'],
                delta=f"{confidence_score:.1f}% confidence",
                delta_color="normal"
            )
        
        with col2:
            st.metric(
                label="💰 Risk Tolerance",
                value=personality_type['risk_tolerance'],
                delta=personality_type['risk_change'],
                delta_color="normal"
            )
        
        with col3:
            st.metric(
                label="🎯 Financial Goals",
                value=personality_type['goal_alignment'],
                delta="+15% this month",
                delta_color="normal"
            )
        
        with col4:
            st.metric(
                label="📈 Behavioral Score",
                value=f"{personality_type['behavioral_score']:.1f}/10",
                delta="+0.5 points",
                delta_color="normal"
            )
    
    def show_personality_analysis(self):
        """Show detailed personality analysis with ML insights"""
        st.subheader("📊 Personality Analysis")
        
        # Personality radar chart
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🎯 Personality Dimensions")
            
            dimensions = self.get_personality_dimensions()
            
            fig = go.Figure()
            
            fig.add_trace(go.Scatterpolar(
                r=dimensions['values'],
                theta=dimensions['labels'],
                fill='toself',
                name='Your Profile',
                line_color='#1f77b4'
            ))
            
            fig.update_layout(
                polar=dict(
                    radialaxis=dict(
                        visible=True,
                        range=[0, 10]
                    )),
                showlegend=False,
                title="Financial Personality Radar Chart"
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Personality comparison
            st.markdown("### 📈 Comparison with Peers")
            
            comparison_data = self.get_personality_comparison()
            
            fig = px.bar(
                comparison_data,
                x='Dimension',
                y='Your Score',
                color='Peer Average',
                title="Personality Dimension Comparison",
                barmode='group'
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        # Detailed personality breakdown
        st.subheader("🔍 Detailed Analysis")
        
        personality_breakdown = self.get_personality_breakdown()
        
        for dimension in personality_breakdown:
            with st.expander(f"{dimension['name']} - {dimension['score']}/10"):
                col1, col2 = st.columns([2, 1])
                
                with col1:
                    st.markdown(f"**Description:** {dimension['description']}")
                    st.markdown(f"**Impact:** {dimension['impact']}")
                    st.markdown(f"**Recommendation:** {dimension['recommendation']}")
                
                with col2:
                    st.progress(dimension['score'] / 10)
                    st.caption(f"Score: {dimension['score']}/10")
    
    def show_ai_insights(self):
        """Show AI-powered personality insights"""
        st.subheader("🤖 AI-Powered Personality Insights")
        
        # ML clustering results
        cluster_analysis = self.analyze_personality_cluster()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🧠 ML Cluster Analysis")
            
            st.info(f"**Cluster:** {cluster_analysis['cluster_name']}")
            st.info(f"**Size:** {cluster_analysis['cluster_size']} users")
            st.info(f"**Similarity:** {cluster_analysis['similarity']}%")
            
            # Cluster characteristics
            st.markdown("### 🎯 Cluster Characteristics")
            
            for trait in cluster_analysis['traits']:
                st.markdown(f"• {trait}")
        
        with col2:
            # Behavioral predictions
            st.markdown("### 🔮 Behavioral Predictions")
            
            predictions = self.generate_behavioral_predictions()
            
            for prediction in predictions:
                st.success(prediction)
        
        # AI-generated insights
        st.markdown("### 🧠 AI Insights")
        
        insights = [
            "Your personality type suggests you're naturally cautious with money - this is good for long-term stability",
            "You show strong goal-oriented behavior, which aligns well with retirement planning",
            "Your risk tolerance is moderate, making you suitable for balanced investment strategies",
            "You tend to be influenced by social factors in financial decisions - consider peer pressure awareness"
        ]
        
        for insight in insights:
            st.info(insight)
    
    def show_personalized_recommendations(self):
        """Show personalized recommendations based on personality"""
        st.subheader("🎯 Personalized Recommendations")
        
        # Get recommendations based on personality
        recommendations = self.generate_personality_recommendations()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 💰 Financial Strategy")
            
            for rec in recommendations['financial_strategy']:
                st.markdown(f"**{rec['title']}**")
                st.markdown(f"{rec['description']}")
                st.markdown(f"*Priority: {rec['priority']}*")
                st.markdown("---")
        
        with col2:
            st.markdown("### 🎯 Behavioral Tips")
            
            for tip in recommendations['behavioral_tips']:
                st.markdown(f"**{tip['title']}**")
                st.markdown(f"{tip['description']}")
                st.markdown(f"*Impact: {tip['impact']}*")
                st.markdown("---")
        
        # Investment recommendations
        st.markdown("### 📈 Investment Recommendations")
        
        investment_recs = recommendations['investment_recommendations']
        
        for rec in investment_recs:
            with st.expander(f"{rec['title']} - {rec['risk_level']}"):
                st.markdown(f"**Description:** {rec['description']}")
                st.markdown(f"**Expected Return:** {rec['expected_return']}")
                st.markdown(f"**Time Horizon:** {rec['time_horizon']}")
                st.markdown(f"**Why for you:** {rec['personality_fit']}")
    
    def show_behavioral_patterns(self):
        """Show behavioral patterns and trends"""
        st.subheader("📈 Behavioral Patterns")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Spending patterns over time
            st.markdown("### 💸 Spending Pattern Analysis")
            
            spending_data = self.get_spending_patterns()
            
            fig = go.Figure()
            
            fig.add_trace(go.Scatter(
                x=spending_data['dates'],
                y=spending_data['amounts'],
                mode='lines+markers',
                name='Spending',
                line=dict(color='#dc3545', width=3)
            ))
            
            fig.update_layout(
                title="Spending Patterns Over Time",
                xaxis_title="Date",
                yaxis_title="Amount ($)",
                height=400
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Decision-making patterns
            st.markdown("### 🧠 Decision-Making Patterns")
            
            decision_patterns = [
                "Impulse purchases: 15% of total spending",
                "Planned purchases: 85% of total spending",
                "Social influence: High on dining decisions",
                "Emotional spending: Low during stress periods",
                "Goal-oriented spending: 60% of discretionary budget"
            ]
            
            for pattern in decision_patterns:
                st.info(pattern)
        
        # Behavioral insights
        st.markdown("### 🧠 Behavioral Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**📊 Pattern Analysis:**")
            st.success("You show consistent spending patterns")
            st.warning("Consider reducing impulse purchases")
            st.info("Your goal-oriented behavior is strong")
        
        with col2:
            st.markdown("**🎯 Improvement Areas:**")
            st.markdown("• Monitor social spending influence")
            st.markdown("• Set stricter impulse purchase limits")
            st.markdown("• Leverage goal-oriented behavior")
            st.markdown("• Build on consistent patterns")
    
    def get_personality_type(self):
        """Get user's financial personality type"""
        return {
            'name': 'Cautious Planner',
            'risk_tolerance': 'Moderate',
            'risk_change': '+0.2',
            'goal_alignment': 'High',
            'behavioral_score': 7.8
        }
    
    def calculate_confidence_score(self):
        """Calculate confidence score for personality assessment"""
        return 87.5  # Mock data
    
    def get_personality_dimensions(self):
        """Get personality dimensions for radar chart"""
        return {
            'labels': ['Risk Tolerance', 'Goal Orientation', 'Impulse Control', 'Social Influence', 'Financial Knowledge', 'Planning Tendency'],
            'values': [6.5, 8.2, 7.8, 5.3, 7.1, 8.5]
        }
    
    def get_personality_comparison(self):
        """Get personality comparison with peers"""
        return pd.DataFrame({
            'Dimension': ['Risk Tolerance', 'Goal Orientation', 'Impulse Control', 'Social Influence', 'Financial Knowledge', 'Planning Tendency'],
            'Your Score': [6.5, 8.2, 7.8, 5.3, 7.1, 8.5],
            'Peer Average': [5.8, 6.9, 6.2, 6.1, 6.5, 7.2]
        })
    
    def get_personality_breakdown(self):
        """Get detailed personality breakdown"""
        return [
            {
                'name': 'Risk Tolerance',
                'score': 6.5,
                'description': 'You prefer moderate risk with steady returns',
                'impact': 'Suitable for balanced investment portfolios',
                'recommendation': 'Consider 60/40 stock/bond allocation'
            },
            {
                'name': 'Goal Orientation',
                'score': 8.2,
                'description': 'You are highly focused on achieving financial goals',
                'impact': 'Excellent for long-term financial planning',
                'recommendation': 'Set specific, measurable financial goals'
            },
            {
                'name': 'Impulse Control',
                'score': 7.8,
                'description': 'You generally resist impulse purchases well',
                'impact': 'Good for maintaining budget discipline',
                'recommendation': 'Continue using 24-hour rule for purchases'
            },
            {
                'name': 'Social Influence',
                'score': 5.3,
                'description': 'You are moderately influenced by social factors',
                'impact': 'May overspend in social situations',
                'recommendation': 'Set social spending limits'
            },
            {
                'name': 'Financial Knowledge',
                'score': 7.1,
                'description': 'You have good understanding of financial concepts',
                'impact': 'Confident in making financial decisions',
                'recommendation': 'Continue learning advanced topics'
            },
            {
                'name': 'Planning Tendency',
                'score': 8.5,
                'description': 'You are highly organized in financial planning',
                'impact': 'Excellent for achieving long-term goals',
                'recommendation': 'Leverage planning skills for complex goals'
            }
        ]
    
    def analyze_personality_cluster(self):
        """Analyze personality cluster using ML"""
        return {
            'cluster_name': 'Cautious Planners',
            'cluster_size': 1250,
            'similarity': 92,
            'traits': [
                'Prefers steady, predictable returns',
                'High emphasis on financial security',
                'Strong planning and organization skills',
                'Moderate risk tolerance',
                'Goal-oriented behavior'
            ]
        }
    
    def generate_behavioral_predictions(self):
        """Generate behavioral predictions using ML"""
        return [
            "You're likely to increase savings by 15% in the next 6 months",
            "High probability of maintaining emergency fund above recommended levels",
            "Likely to prefer index funds over individual stocks",
            "Strong tendency to stick to budget plans",
            "May need reminders for social spending control"
        ]
    
    def generate_personality_recommendations(self):
        """Generate personalized recommendations based on personality"""
        return {
            'financial_strategy': [
                {
                    'title': 'Balanced Investment Portfolio',
                    'description': '60% stocks, 40% bonds with focus on index funds',
                    'priority': 'High'
                },
                {
                    'title': 'Emergency Fund Enhancement',
                    'description': 'Increase emergency fund to 6 months of expenses',
                    'priority': 'Medium'
                },
                {
                    'title': 'Goal-Based Savings',
                    'description': 'Set up automatic transfers for specific goals',
                    'priority': 'High'
                }
            ],
            'behavioral_tips': [
                {
                    'title': 'Social Spending Limits',
                    'description': 'Set monthly limits for dining and entertainment',
                    'impact': 'High'
                },
                {
                    'title': '24-Hour Purchase Rule',
                    'description': 'Wait 24 hours before non-essential purchases',
                    'impact': 'Medium'
                },
                {
                    'title': 'Goal Visualization',
                    'description': 'Create visual reminders of financial goals',
                    'impact': 'High'
                }
            ],
            'investment_recommendations': [
                {
                    'title': 'Target Date Fund',
                    'description': 'Automatically adjusting portfolio based on retirement date',
                    'risk_level': 'Moderate',
                    'expected_return': '7-9%',
                    'time_horizon': 'Long-term',
                    'personality_fit': 'Matches your planning tendency and moderate risk tolerance'
                },
                {
                    'title': 'Dividend Growth Stocks',
                    'description': 'Stable companies with growing dividend payments',
                    'risk_level': 'Moderate',
                    'expected_return': '6-8%',
                    'time_horizon': 'Medium-term',
                    'personality_fit': 'Aligns with your preference for steady returns'
                },
                {
                    'title': 'Bond Ladder',
                    'description': 'Diversified bond portfolio with staggered maturities',
                    'risk_level': 'Low',
                    'expected_return': '4-6%',
                    'time_horizon': 'Medium-term',
                    'personality_fit': 'Provides stability and predictable income'
                }
            ]
        }
    
    def get_spending_patterns(self):
        """Get spending pattern data"""
        dates = pd.date_range(start='2024-01-01', end='2024-01-31', freq='D')
        amounts = [120, 85, 200, 150, 90, 300, 75, 180, 110, 250, 95, 160, 140, 220, 80, 190, 130, 170, 100, 240, 115, 155, 185, 125, 175, 105, 195, 145, 165, 135, 205]
        
        return {
            'dates': dates,
            'amounts': amounts
        }
    
    def get_personality_data(self):
        """Get personality assessment data"""
        return {
            'assessment_completed': True,
            'last_assessment': '2024-01-15',
            'assessment_score': 87.5,
            'personality_type': 'Cautious Planner'
        } 