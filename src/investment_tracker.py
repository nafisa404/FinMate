import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import yfinance as yf
import requests

class InvestmentTracker:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.portfolio = self.get_mock_portfolio()
        self.market_data = self.get_mock_market_data()
        self.ml_model = self.initialize_ml_model()
        
    def show(self):
        st.title("📈 Investment Tracker")
        st.markdown("---")
        
        # Portfolio overview
        self.show_portfolio_overview()
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "💼 Portfolio Analysis", 
            "🤖 AI Insights", 
            "📊 Market Data", 
            "🎯 Investment Recommendations"
        ])
        
        with tab1:
            self.show_portfolio_analysis()
        
        with tab2:
            self.show_ai_insights()
        
        with tab3:
            self.show_market_data()
        
        with tab4:
            self.show_investment_recommendations()
    
    def initialize_ml_model(self):
        """Initialize ML model for investment predictions"""
        # In a real app, this would load a trained model
        return {
            'risk_analyzer': RandomForestRegressor(),
            'return_predictor': RandomForestRegressor(),
            'portfolio_optimizer': None
        }
    
    def show_portfolio_overview(self):
        """Display portfolio overview metrics"""
        st.subheader("📊 Portfolio Overview")
        
        # Calculate portfolio metrics
        total_value = sum(asset['current_value'] for asset in self.portfolio)
        total_cost = sum(asset['total_cost'] for asset in self.portfolio)
        total_gain_loss = total_value - total_cost
        total_gain_loss_percent = (total_gain_loss / total_cost) * 100 if total_cost > 0 else 0
        
        # Risk metrics
        portfolio_risk = self.calculate_portfolio_risk()
        diversification_score = self.calculate_diversification_score()
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="💰 Total Value",
                value=f"${total_value:,.2f}",
                delta=f"${total_gain_loss:+,.2f}",
                delta_color="normal" if total_gain_loss >= 0 else "inverse"
            )
        
        with col2:
            st.metric(
                label="📈 Total Return",
                value=f"{total_gain_loss_percent:+.2f}%",
                delta=f"${total_gain_loss:+,.2f}",
                delta_color="normal" if total_gain_loss >= 0 else "inverse"
            )
        
        with col3:
            st.metric(
                label="⚠️ Risk Level",
                value=portfolio_risk,
                delta="Moderate",
                delta_color="normal"
            )
        
        with col4:
            st.metric(
                label="🎯 Diversification",
                value=f"{diversification_score:.1f}/10",
                delta="Good",
                delta_color="normal"
            )
    
    def show_portfolio_analysis(self):
        """Show detailed portfolio analysis with ML insights"""
        st.subheader("💼 Portfolio Analysis")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Portfolio allocation pie chart
            allocation_data = []
            for asset in self.portfolio:
                allocation_data.append({
                    'Asset': asset['name'],
                    'Value': asset['current_value'],
                    'Category': asset['category']
                })
            
            df = pd.DataFrame(allocation_data)
            
            fig = px.pie(
                df,
                values='Value',
                names='Asset',
                title="Portfolio Allocation",
                color_discrete_sequence=px.colors.qualitative.Set3
            )
            
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Performance comparison
            performance_data = []
            for asset in self.portfolio:
                performance_data.append({
                    'Asset': asset['name'],
                    'Return %': asset['return_percent'],
                    'Risk': asset['risk_level']
                })
            
            df_perf = pd.DataFrame(performance_data)
            
            fig = px.scatter(
                df_perf,
                x='Risk',
                y='Return %',
                size='Return %',
                color='Asset',
                title="Risk vs Return Analysis"
            )
            
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        
        # Detailed asset analysis
        st.subheader("📋 Asset Details")
        
        for asset in self.portfolio:
            with st.expander(f"{asset['name']} - ${asset['current_value']:,.2f}"):
                col1, col2, col3 = st.columns([2, 1, 1])
                
                with col1:
                    st.write(f"**Category:** {asset['category']}")
                    st.write(f"**Shares/Units:** {asset['quantity']:,.2f}")
                    st.write(f"**Average Cost:** ${asset['avg_cost']:.2f}")
                    st.write(f"**Current Price:** ${asset['current_price']:.2f}")
                    
                    # Performance indicator
                    return_color = "green" if asset['return_percent'] >= 0 else "red"
                    st.markdown(f"**Return:** <span style='color: {return_color};'>{asset['return_percent']:+.2f}%</span>", unsafe_allow_html=True)
                
                with col2:
                    st.metric(
                        "Total Cost",
                        f"${asset['total_cost']:.2f}",
                        f"${asset['gain_loss']:+.2f}"
                    )
                
                with col3:
                    # AI analysis
                    ai_analysis = self.analyze_asset(asset)
                    st.markdown(f"**🤖 AI Analysis:**\n{ai_analysis}")
    
    def show_ai_insights(self):
        """Show AI-powered investment insights"""
        st.subheader("🤖 AI-Powered Investment Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Portfolio health score
            health_score = self.calculate_portfolio_health()
            st.markdown("### 🏥 Portfolio Health Score")
            
            if health_score >= 80:
                st.success(f"**Excellent: {health_score}/100**")
                st.markdown("Your portfolio is well-diversified and performing above average.")
            elif health_score >= 60:
                st.info(f"**Good: {health_score}/100**")
                st.markdown("Your portfolio is performing well with room for improvement.")
            else:
                st.warning(f"**Needs Attention: {health_score}/100**")
                st.markdown("Consider rebalancing and diversifying your portfolio.")
            
            # Risk analysis
            st.markdown("### ⚠️ Risk Analysis")
            
            risk_insights = [
                "Your portfolio has moderate risk exposure",
                "Tech stocks represent 40% of your portfolio - consider diversification",
                "Bond allocation is below recommended levels for your age",
                "International exposure is limited - consider global ETFs"
            ]
            
            for insight in risk_insights:
                st.markdown(f"• {insight}")
        
        with col2:
            # Performance predictions
            st.markdown("### 🔮 ML Performance Predictions")
            
            predictions = self.generate_performance_predictions()
            
            for prediction in predictions:
                st.info(prediction)
            
            # Rebalancing recommendations
            st.markdown("### ⚖️ Rebalancing Recommendations")
            
            rebalancing = self.generate_rebalancing_recommendations()
            
            for rec in rebalancing:
                st.markdown(f"• {rec}")
        
        # AI-generated insights
        st.markdown("### 🧠 AI Insights")
        
        insights = [
            "**Market Timing**: Your entry points were well-timed, contributing to positive returns",
            "**Sector Rotation**: Consider reducing tech exposure and increasing healthcare/consumer staples",
            "**Tax Optimization**: Harvest tax losses in underperforming positions",
            "**Dollar-Cost Averaging**: Continue regular investments to reduce timing risk"
        ]
        
        for insight in insights:
            st.info(insight)
    
    def show_market_data(self):
        """Show real-time market data and trends"""
        st.subheader("📊 Market Data & Trends")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Market indices
            st.markdown("### 📈 Market Indices")
            
            indices = [
                {"name": "S&P 500", "value": 4850.43, "change": 1.25},
                {"name": "NASDAQ", "value": 15235.70, "change": 2.10},
                {"name": "DOW", "value": 37800.38, "change": 0.85},
                {"name": "VIX", "value": 12.45, "change": -0.30}
            ]
            
            for index in indices:
                color = "green" if index['change'] >= 0 else "red"
                st.markdown(f"**{index['name']}:** ${index['value']:,.2f} <span style='color: {color};'>{index['change']:+.2f}%</span>", unsafe_allow_html=True)
        
        with col2:
            # Sector performance
            st.markdown("### 🏭 Sector Performance")
            
            sectors = [
                {"name": "Technology", "return": 15.2, "trend": "up"},
                {"name": "Healthcare", "return": 8.5, "trend": "up"},
                {"name": "Financial", "return": 5.8, "trend": "up"},
                {"name": "Energy", "return": -2.1, "trend": "down"},
                {"name": "Consumer", "return": 12.3, "trend": "up"}
            ]
            
            for sector in sectors:
                color = "green" if sector['return'] >= 0 else "red"
                trend_icon = "📈" if sector['trend'] == "up" else "📉"
                st.markdown(f"{trend_icon} **{sector['name']}:** <span style='color: {color};'>{sector['return']:+.1f}%</span>", unsafe_allow_html=True)
        
        # Market sentiment analysis
        st.markdown("### 🧠 Market Sentiment Analysis")
        
        col1, col2 = st.columns(2)
        
        with col1:
            sentiment_data = {
                'Bullish': 65,
                'Neutral': 25,
                'Bearish': 10
            }
            
            fig = px.pie(
                values=list(sentiment_data.values()),
                names=list(sentiment_data.keys()),
                title="Market Sentiment",
                color_discrete_sequence=['#28a745', '#ffc107', '#dc3545']
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            st.markdown("**AI Market Analysis:**")
            st.info("""
            • Market sentiment is moderately bullish
            • Tech sector showing strong momentum
            • Volatility expected to remain low
            • Consider defensive positions in utilities
            """)
    
    def show_investment_recommendations(self):
        """Show AI-generated investment recommendations"""
        st.subheader("🎯 AI Investment Recommendations")
        
        # Portfolio optimization
        st.markdown("### ⚖️ Portfolio Optimization")
        
        optimization = self.generate_portfolio_optimization()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**Current Allocation:**")
            for item in optimization['current']:
                st.markdown(f"• {item}")
        
        with col2:
            st.markdown("**Recommended Allocation:**")
            for item in optimization['recommended']:
                st.markdown(f"• {item}")
        
        # Stock recommendations
        st.markdown("### 📈 Stock Recommendations")
        
        recommendations = self.generate_stock_recommendations()
        
        for rec in recommendations:
            with st.expander(f"{rec['name']} - {rec['action']}"):
                st.markdown(f"""
                **Analysis:**
                {rec['analysis']}
                
                **Risk Level:** {rec['risk']}
                **Expected Return:** {rec['expected_return']}%
                **Time Horizon:** {rec['time_horizon']}
                
                **Recommendation:** {rec['recommendation']}
                """)
        
        # Investment strategies
        st.markdown("### 💡 Investment Strategies")
        
        strategies = [
            {
                "name": "Dollar-Cost Averaging",
                "description": "Invest fixed amounts regularly regardless of market conditions",
                "benefit": "Reduces timing risk and emotional investing",
                "suitable_for": "Long-term investors"
            },
            {
                "name": "Value Investing",
                "description": "Focus on undervalued stocks with strong fundamentals",
                "benefit": "Potential for above-average returns with lower risk",
                "suitable_for": "Patient investors"
            },
            {
                "name": "Growth Investing",
                "description": "Invest in companies with high growth potential",
                "benefit": "Higher potential returns in bull markets",
                "suitable_for": "Risk-tolerant investors"
            }
        ]
        
        for strategy in strategies:
            with st.expander(strategy['name']):
                st.markdown(f"**Description:** {strategy['description']}")
                st.markdown(f"**Benefit:** {strategy['benefit']}")
                st.markdown(f"**Suitable for:** {strategy['suitable_for']}")
    
    def calculate_portfolio_risk(self):
        """Calculate portfolio risk using ML"""
        # Simplified risk calculation
        risk_factors = {
            'tech_concentration': 0.4,  # 40% in tech
            'volatility': 0.15,         # 15% volatility
            'correlation': 0.6          # 60% correlation
        }
        
        total_risk = (risk_factors['tech_concentration'] * 0.4 + 
                     risk_factors['volatility'] * 0.4 + 
                     risk_factors['correlation'] * 0.2)
        
        if total_risk < 0.3:
            return "Low"
        elif total_risk < 0.6:
            return "Moderate"
        else:
            return "High"
    
    def calculate_diversification_score(self):
        """Calculate portfolio diversification score"""
        categories = {}
        total_value = sum(asset['current_value'] for asset in self.portfolio)
        
        for asset in self.portfolio:
            category = asset['category']
            categories[category] = categories.get(category, 0) + asset['current_value']
        
        # Calculate Herfindahl index (lower is better)
        h_index = sum((value / total_value) ** 2 for value in categories.values())
        
        # Convert to 1-10 scale (10 is most diversified)
        diversification_score = 10 * (1 - h_index)
        
        return diversification_score
    
    def calculate_portfolio_health(self):
        """Calculate overall portfolio health score"""
        factors = {
            'diversification': self.calculate_diversification_score() * 10,  # 0-100
            'performance': 75,  # Mock performance score
            'risk_management': 80,  # Mock risk score
            'liquidity': 90  # Mock liquidity score
        }
        
        # Weighted average
        weights = [0.3, 0.3, 0.2, 0.2]
        health_score = sum(factor * weight for factor, weight in zip(factors.values(), weights))
        
        return health_score
    
    def analyze_asset(self, asset):
        """Analyze individual asset using AI"""
        if asset['return_percent'] > 10:
            return "Strong performer. Consider taking partial profits."
        elif asset['return_percent'] > 0:
            return "Performing well. Hold position."
        elif asset['return_percent'] > -10:
            return "Underperforming. Monitor closely."
        else:
            return "Significant losses. Consider tax-loss harvesting."
    
    def generate_performance_predictions(self):
        """Generate ML-based performance predictions"""
        return [
            "Portfolio expected to return 8-12% annually over next 5 years",
            "Tech sector may face headwinds in Q2 2024",
            "Healthcare stocks likely to outperform in 2024",
            "Consider increasing bond allocation for stability"
        ]
    
    def generate_rebalancing_recommendations(self):
        """Generate rebalancing recommendations"""
        return [
            "Reduce tech allocation from 40% to 30%",
            "Increase bond allocation from 10% to 20%",
            "Add international exposure (currently 5%, target 15%)",
            "Consider adding REITs for diversification"
        ]
    
    def generate_portfolio_optimization(self):
        """Generate portfolio optimization recommendations"""
        return {
            'current': [
                "Technology: 40%",
                "Healthcare: 25%",
                "Financial: 20%",
                "Bonds: 10%",
                "International: 5%"
            ],
            'recommended': [
                "Technology: 30%",
                "Healthcare: 25%",
                "Financial: 20%",
                "Bonds: 20%",
                "International: 5%"
            ]
        }
    
    def generate_stock_recommendations(self):
        """Generate AI-powered stock recommendations"""
        return [
            {
                'name': 'AAPL',
                'action': 'BUY',
                'analysis': 'Strong fundamentals, innovative product pipeline, solid cash flow',
                'risk': 'Low',
                'expected_return': 15,
                'time_horizon': '1-2 years',
                'recommendation': 'Add to position on dips'
            },
            {
                'name': 'MSFT',
                'action': 'HOLD',
                'analysis': 'Good performance, but valuation is stretched',
                'risk': 'Medium',
                'expected_return': 10,
                'time_horizon': '2-3 years',
                'recommendation': 'Maintain current position'
            },
            {
                'name': 'JNJ',
                'action': 'BUY',
                'analysis': 'Defensive stock, stable earnings, dividend growth',
                'risk': 'Low',
                'expected_return': 8,
                'time_horizon': '3-5 years',
                'recommendation': 'Add for stability and income'
            }
        ]
    
    def get_mock_portfolio(self):
        """Generate mock portfolio data"""
        return [
            {
                'id': 1,
                'name': 'AAPL',
                'category': 'Technology',
                'quantity': 50,
                'avg_cost': 150.00,
                'current_price': 175.50,
                'total_cost': 7500.00,
                'current_value': 8775.00,
                'gain_loss': 1275.00,
                'return_percent': 17.0,
                'risk_level': 'Medium'
            },
            {
                'id': 2,
                'name': 'MSFT',
                'category': 'Technology',
                'quantity': 30,
                'avg_cost': 280.00,
                'current_price': 320.00,
                'total_cost': 8400.00,
                'current_value': 9600.00,
                'gain_loss': 1200.00,
                'return_percent': 14.3,
                'risk_level': 'Medium'
            },
            {
                'id': 3,
                'name': 'JNJ',
                'category': 'Healthcare',
                'quantity': 100,
                'avg_cost': 160.00,
                'current_price': 165.00,
                'total_cost': 16000.00,
                'current_value': 16500.00,
                'gain_loss': 500.00,
                'return_percent': 3.1,
                'risk_level': 'Low'
            },
            {
                'id': 4,
                'name': 'VOO',
                'category': 'ETF',
                'quantity': 25,
                'avg_cost': 400.00,
                'current_price': 420.00,
                'total_cost': 10000.00,
                'current_value': 10500.00,
                'gain_loss': 500.00,
                'return_percent': 5.0,
                'risk_level': 'Low'
            }
        ]
    
    def get_mock_market_data(self):
        """Generate mock market data"""
        return {
            'sp500': {'value': 4850.43, 'change': 1.25},
            'nasdaq': {'value': 15235.70, 'change': 2.10},
            'dow': {'value': 37800.38, 'change': 0.85},
            'vix': {'value': 12.45, 'change': -0.30}
        } 