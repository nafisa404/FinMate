import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import re

class SubscriptionDetox:
    def __init__(self):
        self.user_id = st.session_state.get("user_id")
        self.subscriptions = self.get_mock_subscriptions()
        
    def show(self):
        st.title("📦 Subscription Detox")
        st.markdown("---")
        
        # Overview metrics
        self.show_overview_metrics()
        
        # Tabs for different features
        tab1, tab2, tab3, tab4 = st.tabs([
            "🔍 Subscription Analysis", 
            "🤖 AI Recommendations", 
            "📊 Usage Analytics", 
            "💡 Money Saving Tips"
        ])
        
        with tab1:
            self.show_subscription_analysis()
        
        with tab2:
            self.show_ai_recommendations()
        
        with tab3:
            self.show_usage_analytics()
        
        with tab4:
            self.show_money_saving_tips()
    
    def show_overview_metrics(self):
        """Display subscription overview metrics"""
        st.subheader("📊 Subscription Overview")
        
        total_monthly_cost = sum(sub['monthly_cost'] for sub in self.subscriptions)
        total_yearly_cost = total_monthly_cost * 12
        unused_subscriptions = len([sub for sub in self.subscriptions if sub['usage_score'] < 0.3])
        potential_savings = sum(sub['monthly_cost'] for sub in self.subscriptions if sub['usage_score'] < 0.3)
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="💰 Monthly Cost",
                value=f"${total_monthly_cost:,.2f}",
                delta=f"${total_monthly_cost * 0.05:+.2f}",
                delta_color="inverse"
            )
        
        with col2:
            st.metric(
                label="📅 Yearly Cost",
                value=f"${total_yearly_cost:,.2f}",
                help="Total annual subscription costs"
            )
        
        with col3:
            st.metric(
                label="⚠️ Unused Subscriptions",
                value=unused_subscriptions,
                delta=f"${potential_savings:,.2f} potential savings",
                delta_color="normal"
            )
        
        with col4:
            st.metric(
                label="🎯 Usage Score",
                value=f"{self.calculate_overall_usage_score():.1f}%",
                delta=f"{self.calculate_usage_trend():+.1f}%",
                delta_color="normal" if self.calculate_usage_trend() >= 0 else "inverse"
            )
    
    def show_subscription_analysis(self):
        """Show detailed subscription analysis with AI insights"""
        st.subheader("🔍 Subscription Analysis")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Subscription breakdown chart
            subscription_data = []
            for sub in self.subscriptions:
                subscription_data.append({
                    'Name': sub['name'],
                    'Cost': sub['monthly_cost'],
                    'Usage': sub['usage_score'] * 100,
                    'Category': sub['category']
                })
            
            df = pd.DataFrame(subscription_data)
            
            fig = px.bar(
                df,
                x='Name',
                y='Cost',
                color='Usage',
                title="Monthly Subscription Costs vs Usage",
                color_continuous_scale='RdYlGn'
            )
            
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Usage vs Cost scatter plot
            fig = px.scatter(
                df,
                x='Cost',
                y='Usage',
                size='Cost',
                color='Category',
                hover_data=['Name'],
                title="Usage vs Cost Analysis"
            )
            
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        
        # Detailed subscription list with AI insights
        st.subheader("📋 Subscription Details")
        
        for subscription in self.subscriptions:
            with st.expander(f"{subscription['name']} - ${subscription['monthly_cost']:.2f}/month"):
                col1, col2, col3 = st.columns([2, 1, 1])
                
                with col1:
                    st.write(f"**Category:** {subscription['category']}")
                    st.write(f"**Billing Cycle:** {subscription['billing_cycle']}")
                    st.write(f"**Next Billing:** {subscription['next_billing']}")
                    
                    # Usage analysis
                    usage_percentage = subscription['usage_score'] * 100
                    st.progress(usage_percentage / 100)
                    st.caption(f"Usage: {usage_percentage:.1f}%")
                
                with col2:
                    st.metric(
                        "Monthly Cost",
                        f"${subscription['monthly_cost']:.2f}",
                        f"${subscription['yearly_cost']:.2f}/year"
                    )
                
                with col3:
                    # AI recommendation
                    if subscription['usage_score'] < 0.3:
                        st.error("❌ Consider Canceling")
                        st.caption("Low usage detected")
                    elif subscription['usage_score'] < 0.6:
                        st.warning("⚠️ Monitor Usage")
                        st.caption("Moderate usage")
                    else:
                        st.success("✅ Good Value")
                        st.caption("High usage")
                
                # AI-powered insights
                st.markdown("**🤖 AI Insights:**")
                insights = self.generate_subscription_insights(subscription)
                st.markdown(insights)
    
    def show_ai_recommendations(self):
        """Show AI-powered subscription recommendations"""
        st.subheader("🤖 AI-Powered Recommendations")
        
        # Categorize subscriptions by recommendation
        cancel_recommendations = []
        optimize_recommendations = []
        keep_recommendations = []
        
        for subscription in self.subscriptions:
            if subscription['usage_score'] < 0.3:
                cancel_recommendations.append(subscription)
            elif subscription['usage_score'] < 0.6:
                optimize_recommendations.append(subscription)
            else:
                keep_recommendations.append(subscription)
        
        # Cancel recommendations
        if cancel_recommendations:
            st.markdown("### ❌ Recommended for Cancellation")
            total_savings = sum(sub['monthly_cost'] for sub in cancel_recommendations)
            
            st.info(f"**Potential Monthly Savings:** ${total_savings:.2f} ({total_savings * 12:.2f}/year)")
            
            for subscription in cancel_recommendations:
                with st.expander(f"Cancel {subscription['name']} - Save ${subscription['monthly_cost']:.2f}/month"):
                    st.markdown(f"""
                    **Reason:** Low usage ({subscription['usage_score'] * 100:.1f}%)
                    
                    **Savings Impact:**
                    - Monthly: ${subscription['monthly_cost']:.2f}
                    - Yearly: ${subscription['yearly_cost']:.2f}
                    
                    **Alternative Options:**
                    {self.suggest_alternatives(subscription)}
                    
                    **Cancellation Steps:**
                    1. Log into your {subscription['name']} account
                    2. Go to billing settings
                    3. Cancel subscription
                    4. Confirm cancellation
                    """)
        
        # Optimize recommendations
        if optimize_recommendations:
            st.markdown("### ⚠️ Optimization Opportunities")
            
            for subscription in optimize_recommendations:
                with st.expander(f"Optimize {subscription['name']}"):
                    st.markdown(f"""
                    **Current Usage:** {subscription['usage_score'] * 100:.1f}%
                    
                    **Optimization Options:**
                    {self.suggest_optimizations(subscription)}
                    
                    **Usage Tracking:**
                    - Set usage reminders
                    - Monitor feature utilization
                    - Consider downgrading plan
                    """)
        
        # Keep recommendations
        if keep_recommendations:
            st.markdown("### ✅ Good Value Subscriptions")
            
            for subscription in keep_recommendations:
                with st.expander(f"Keep {subscription['name']}"):
                    st.markdown(f"""
                    **Usage:** {subscription['usage_score'] * 100:.1f}%
                    
                    **Value Assessment:**
                    - High utilization rate
                    - Good cost-to-value ratio
                    - Essential for your needs
                    
                    **Recommendation:** Continue using this subscription
                    """)
        
        # AI summary
        st.markdown("### 📊 AI Summary")
        
        total_current_cost = sum(sub['monthly_cost'] for sub in self.subscriptions)
        potential_monthly_savings = sum(sub['monthly_cost'] for sub in cancel_recommendations)
        optimized_savings = sum(sub['monthly_cost'] * 0.3 for sub in optimize_recommendations)
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                "Current Monthly Cost",
                f"${total_current_cost:.2f}"
            )
        
        with col2:
            st.metric(
                "Potential Savings",
                f"${potential_monthly_savings + optimized_savings:.2f}/month"
            )
        
        with col3:
            savings_percentage = ((potential_monthly_savings + optimized_savings) / total_current_cost) * 100
            st.metric(
                "Savings Potential",
                f"{savings_percentage:.1f}%"
            )
    
    def show_usage_analytics(self):
        """Show detailed usage analytics with ML insights"""
        st.subheader("📊 Usage Analytics")
        
        # Usage trends over time
        col1, col2 = st.columns(2)
        
        with col1:
            # Usage heatmap
            st.subheader("🔥 Usage Heatmap")
            
            # Mock usage data over time
            dates = pd.date_range(start='2024-01-01', end='2024-01-31', freq='D')
            usage_data = []
            
            for date in dates:
                for subscription in self.subscriptions:
                    usage_data.append({
                        'Date': date,
                        'Subscription': subscription['name'],
                        'Usage': np.random.normal(subscription['usage_score'], 0.1)
                    })
            
            df_usage = pd.DataFrame(usage_data)
            
            fig = px.density_heatmap(
                df_usage,
                x='Date',
                y='Subscription',
                z='Usage',
                title="Daily Usage Patterns"
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Category analysis
            st.subheader("📈 Category Analysis")
            
            category_data = {}
            for subscription in self.subscriptions:
                category = subscription['category']
                if category not in category_data:
                    category_data[category] = {
                        'total_cost': 0,
                        'avg_usage': 0,
                        'count': 0
                    }
                
                category_data[category]['total_cost'] += subscription['monthly_cost']
                category_data[category]['avg_usage'] += subscription['usage_score']
                category_data[category]['count'] += 1
            
            # Calculate averages
            for category in category_data:
                category_data[category]['avg_usage'] /= category_data[category]['count']
            
            category_df = pd.DataFrame([
                {
                    'Category': cat,
                    'Total Cost': data['total_cost'],
                    'Average Usage': data['avg_usage'] * 100,
                    'Subscription Count': data['count']
                }
                for cat, data in category_data.items()
            ])
            
            fig = px.scatter(
                category_df,
                x='Total Cost',
                y='Average Usage',
                size='Subscription Count',
                color='Category',
                title="Category Cost vs Usage"
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        # ML-powered usage predictions
        st.subheader("🔮 Usage Predictions")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.info("**Usage Trend Analysis**\n\nBased on your usage patterns, AI predicts:\n- Netflix usage will decrease by 15% next month\n- Spotify usage will remain stable\n- Gym membership usage will increase by 20%")
        
        with col2:
            st.success("**Optimization Opportunities**\n\nML suggests:\n- Downgrade Netflix to basic plan (save $8/month)\n- Switch to Spotify family plan (save $5/month)\n- Consider annual billing for gym (save 10%)")
    
    def show_money_saving_tips(self):
        """Show AI-generated money saving tips"""
        st.subheader("💡 AI-Generated Money Saving Tips")
        
        # Personalized tips based on subscription data
        tips = self.generate_personalized_tips()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🎯 Personalized Recommendations")
            
            for i, tip in enumerate(tips['personalized'], 1):
                st.markdown(f"**{i}. {tip['title']}**")
                st.markdown(f"{tip['description']}")
                st.markdown(f"*Potential Savings: ${tip['savings']:.2f}/month*")
                st.markdown("---")
        
        with col2:
            st.markdown("### 💰 General Subscription Tips")
            
            general_tips = [
                "Review subscriptions quarterly",
                "Use annual billing when possible",
                "Share family plans with trusted friends",
                "Set usage reminders",
                "Cancel before free trials end",
                "Negotiate with customer service",
                "Use student discounts when eligible",
                "Consider bundle deals"
            ]
            
            for i, tip in enumerate(general_tips, 1):
                st.markdown(f"{i}. {tip}")
        
        # Subscription optimization calculator
        st.markdown("### 🧮 Savings Calculator")
        
        col1, col2 = st.columns(2)
        
        with col1:
            current_monthly = st.number_input(
                "Current Monthly Cost ($)",
                min_value=0.0,
                value=150.0,
                step=10.0
            )
            
            potential_savings = st.number_input(
                "Potential Monthly Savings ($)",
                min_value=0.0,
                value=50.0,
                step=10.0
            )
        
        with col2:
            new_monthly = current_monthly - potential_savings
            yearly_savings = potential_savings * 12
            
            st.metric("New Monthly Cost", f"${new_monthly:.2f}")
            st.metric("Yearly Savings", f"${yearly_savings:.2f}")
            st.metric("Savings Percentage", f"{(potential_savings/current_monthly)*100:.1f}%")
    
    def get_mock_subscriptions(self):
        """Generate mock subscription data"""
        return [
            {
                'id': 1,
                'name': 'Netflix',
                'category': 'Entertainment',
                'monthly_cost': 15.99,
                'yearly_cost': 191.88,
                'billing_cycle': 'Monthly',
                'next_billing': '2024-02-15',
                'usage_score': 0.8,  # 80% usage
                'last_used': '2024-01-14'
            },
            {
                'id': 2,
                'name': 'Spotify Premium',
                'category': 'Entertainment',
                'monthly_cost': 9.99,
                'yearly_cost': 119.88,
                'billing_cycle': 'Monthly',
                'next_billing': '2024-02-10',
                'usage_score': 0.9,  # 90% usage
                'last_used': '2024-01-15'
            },
            {
                'id': 3,
                'name': 'Adobe Creative Suite',
                'category': 'Productivity',
                'monthly_cost': 52.99,
                'yearly_cost': 635.88,
                'billing_cycle': 'Monthly',
                'next_billing': '2024-02-20',
                'usage_score': 0.2,  # 20% usage - low usage
                'last_used': '2024-01-05'
            },
            {
                'id': 4,
                'name': 'Gym Membership',
                'category': 'Health & Fitness',
                'monthly_cost': 29.99,
                'yearly_cost': 359.88,
                'billing_cycle': 'Monthly',
                'next_billing': '2024-02-01',
                'usage_score': 0.4,  # 40% usage - moderate
                'last_used': '2024-01-12'
            },
            {
                'id': 5,
                'name': 'Dropbox Pro',
                'category': 'Productivity',
                'monthly_cost': 9.99,
                'yearly_cost': 119.88,
                'billing_cycle': 'Monthly',
                'next_billing': '2024-02-05',
                'usage_score': 0.1,  # 10% usage - very low
                'last_used': '2024-01-01'
            }
        ]
    
    def calculate_overall_usage_score(self):
        """Calculate overall usage score across all subscriptions"""
        total_cost = sum(sub['monthly_cost'] for sub in self.subscriptions)
        weighted_usage = sum(sub['monthly_cost'] * sub['usage_score'] for sub in self.subscriptions)
        return (weighted_usage / total_cost) * 100 if total_cost > 0 else 0
    
    def calculate_usage_trend(self):
        """Calculate usage trend (simplified)"""
        # In real app, this would compare current vs previous period
        return 2.5  # Mock positive trend
    
    def generate_subscription_insights(self, subscription):
        """Generate AI insights for a specific subscription"""
        usage_percentage = subscription['usage_score'] * 100
        
        if usage_percentage < 30:
            return f"""
            - **Low Usage Alert**: You're only using {usage_percentage:.1f}% of this service
            - **Recommendation**: Consider canceling or downgrading
            - **Alternative**: Look for free alternatives or cheaper options
            - **Savings Potential**: ${subscription['monthly_cost']:.2f}/month
            """
        elif usage_percentage < 60:
            return f"""
            - **Moderate Usage**: You're using {usage_percentage:.1f}% of this service
            - **Recommendation**: Monitor usage and consider optimization
            - **Suggestion**: Set usage reminders to maximize value
            - **Optimization**: Consider annual billing for discounts
            """
        else:
            return f"""
            - **High Usage**: You're using {usage_percentage:.1f}% of this service
            - **Recommendation**: Good value for money
            - **Suggestion**: Consider annual billing to save money
            - **Optimization**: Look for family plans if applicable
            """
    
    def suggest_alternatives(self, subscription):
        """Suggest alternatives for a subscription"""
        alternatives = {
            'Netflix': ['Hulu', 'Disney+', 'Amazon Prime Video', 'Free streaming services'],
            'Spotify Premium': ['Apple Music', 'YouTube Music', 'Free Spotify with ads'],
            'Adobe Creative Suite': ['GIMP (free)', 'Canva Pro', 'Affinity Designer'],
            'Gym Membership': ['Home workouts', 'Outdoor activities', 'Community center'],
            'Dropbox Pro': ['Google Drive', 'OneDrive', 'Mega', 'Free cloud storage']
        }
        
        return alternatives.get(subscription['name'], ['Look for free alternatives', 'Consider cheaper options'])
    
    def suggest_optimizations(self, subscription):
        """Suggest optimizations for a subscription"""
        return [
            "Downgrade to a cheaper plan",
            "Switch to annual billing for discounts",
            "Share with family members",
            "Use during peak hours only",
            "Set usage reminders"
        ]
    
    def generate_personalized_tips(self):
        """Generate personalized money saving tips"""
        return {
            'personalized': [
                {
                    'title': 'Cancel Adobe Creative Suite',
                    'description': 'You only use 20% of the features. Consider free alternatives like GIMP or Canva.',
                    'savings': 52.99
                },
                {
                    'title': 'Optimize Gym Membership',
                    'description': 'Consider switching to a cheaper gym or home workout options.',
                    'savings': 15.00
                },
                {
                    'title': 'Cancel Dropbox Pro',
                    'description': 'Switch to free alternatives like Google Drive or OneDrive.',
                    'savings': 9.99
                },
                {
                    'title': 'Downgrade Netflix',
                    'description': 'Switch to basic plan since you don\'t need 4K streaming.',
                    'savings': 8.00
                }
            ]
        } 