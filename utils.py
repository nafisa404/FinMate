import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, List, Any, Optional

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format amount as currency string"""
    if currency == "USD":
        return f"${amount:,.2f}"
    elif currency == "EUR":
        return f"€{amount:,.2f}"
    elif currency == "GBP":
        return f"£{amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"

def format_percentage(value: float) -> str:
    """Format value as percentage"""
    return f"{value:.1f}%"

def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between two values"""
    if old_value == 0:
        return 0
    return ((new_value - old_value) / old_value) * 100

def get_color_for_percentage_change(change: float) -> str:
    """Get color based on percentage change"""
    if change > 0:
        return "green"
    elif change < 0:
        return "red"
    else:
        return "gray"

def create_line_chart(data: pd.DataFrame, x_col: str, y_col: str, title: str = "") -> go.Figure:
    """Create a line chart using plotly"""
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=data[x_col],
        y=data[y_col],
        mode='lines+markers',
        name=y_col,
        line=dict(color='#1f77b4', width=3)
    ))
    
    fig.update_layout(
        title=title,
        xaxis_title=x_col,
        yaxis_title=y_col,
        height=400,
        showlegend=False
    )
    
    return fig

def create_pie_chart(data: pd.DataFrame, values_col: str, names_col: str, title: str = "") -> go.Figure:
    """Create a pie chart using plotly"""
    fig = px.pie(
        data,
        values=values_col,
        names=names_col,
        title=title
    )
    
    fig.update_layout(height=400)
    return fig

def create_bar_chart(data: pd.DataFrame, x_col: str, y_col: str, title: str = "") -> go.Figure:
    """Create a bar chart using plotly"""
    fig = px.bar(
        data,
        x=x_col,
        y=y_col,
        title=title
    )
    
    fig.update_layout(height=400)
    return fig

def generate_mock_data(days: int = 30) -> pd.DataFrame:
    """Generate mock financial data for demonstration"""
    dates = pd.date_range(start=datetime.now() - timedelta(days=days), end=datetime.now(), freq='D')
    
    data = []
    for date in dates:
        data.append({
            'date': date,
            'income': np.random.randint(100, 500),
            'expenses': np.random.randint(50, 300),
            'savings': np.random.randint(20, 150),
            'investments': np.random.randint(10, 100)
        })
    
    return pd.DataFrame(data)

def calculate_financial_metrics(data: pd.DataFrame) -> Dict[str, float]:
    """Calculate key financial metrics"""
    total_income = data['income'].sum()
    total_expenses = data['expenses'].sum()
    total_savings = data['savings'].sum()
    total_investments = data['investments'].sum()
    
    savings_rate = (total_savings / total_income) * 100 if total_income > 0 else 0
    expense_ratio = (total_expenses / total_income) * 100 if total_income > 0 else 0
    
    return {
        'total_income': total_income,
        'total_expenses': total_expenses,
        'total_savings': total_savings,
        'total_investments': total_investments,
        'savings_rate': savings_rate,
        'expense_ratio': expense_ratio
    }

def validate_email(email: str) -> bool:
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> Dict[str, bool]:
    """Validate password strength"""
    checks = {
        'length': len(password) >= 8,
        'uppercase': any(c.isupper() for c in password),
        'lowercase': any(c.islower() for c in password),
        'digit': any(c.isdigit() for c in password),
        'special': any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password)
    }
    
    checks['strong'] = all(checks.values())
    return checks

def show_success_message(message: str):
    """Show success message with styling"""
    st.success(f"✅ {message}")

def show_error_message(message: str):
    """Show error message with styling"""
    st.error(f"❌ {message}")

def show_info_message(message: str):
    """Show info message with styling"""
    st.info(f"ℹ️ {message}")

def show_warning_message(message: str):
    """Show warning message with styling"""
    st.warning(f"⚠️ {message}")

def create_metric_card(title: str, value: str, delta: str = "", delta_color: str = "normal"):
    """Create a styled metric card"""
    st.metric(
        label=title,
        value=value,
        delta=delta,
        delta_color=delta_color
    )

def create_progress_bar(label: str, value: float, max_value: float = 100):
    """Create a progress bar with label"""
    progress = value / max_value
    st.markdown(f"**{label}**")
    st.progress(progress)
    st.caption(f"{value:.1f}/{max_value:.1f}")

def create_expandable_section(title: str, content_func, expanded: bool = False):
    """Create an expandable section"""
    with st.expander(title, expanded=expanded):
        content_func()

def create_tabs_with_content(tab_configs: List[Dict[str, Any]]):
    """Create tabs with content functions"""
    tab_names = [config['name'] for config in tab_configs]
    tab_icons = [config.get('icon', '') for config in tab_configs]
    
    tab_labels = [f"{icon} {name}" for name, icon in zip(tab_names, tab_icons)]
    
    tabs = st.tabs(tab_labels)
    
    for tab, config in zip(tabs, tab_configs):
        with tab:
            config['content_func']()

def create_sidebar_metric(title: str, value: str, delta: str = ""):
    """Create a metric for sidebar"""
    st.metric(
        label=title,
        value=value,
        delta=delta
    )

def create_quick_action_button(label: str, icon: str = "", key: str = None):
    """Create a quick action button"""
    button_text = f"{icon} {label}" if icon else label
    return st.button(button_text, key=key, use_container_width=True)

def format_date(date: datetime) -> str:
    """Format date for display"""
    return date.strftime("%Y-%m-%d")

def format_datetime(dt: datetime) -> str:
    """Format datetime for display"""
    return dt.strftime("%Y-%m-%d %H:%M")

def calculate_age(birth_date: datetime) -> int:
    """Calculate age from birth date"""
    today = datetime.now()
    age = today.year - birth_date.year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    return age

def get_category_color(category: str) -> str:
    """Get color for expense category"""
    colors = {
        'Food & Dining': '#FF6B6B',
        'Transportation': '#4ECDC4',
        'Shopping': '#45B7D1',
        'Bills & Utilities': '#96CEB4',
        'Entertainment': '#FFEAA7',
        'Healthcare': '#DDA0DD',
        'Education': '#98D8C8',
        'Travel': '#F7DC6F',
        'Insurance': '#BB8FCE',
        'Investment': '#85C1E9',
        'Income': '#82E0AA',
        'Other': '#F8C471'
    }
    return colors.get(category, '#BDC3C7')

def create_category_chart(data: pd.DataFrame, category_col: str, amount_col: str) -> go.Figure:
    """Create a chart showing expenses by category"""
    category_totals = data.groupby(category_col)[amount_col].sum().reset_index()
    
    fig = px.pie(
        category_totals,
        values=amount_col,
        names=category_col,
        title="Expenses by Category",
        color_discrete_map={cat: get_category_color(cat) for cat in category_totals[category_col]}
    )
    
    fig.update_layout(height=400)
    return fig 