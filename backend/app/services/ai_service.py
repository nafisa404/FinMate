import openai
from typing import Tuple, Optional
from app.core.config import settings

# Initialize OpenAI client
if settings.OPENAI_API_KEY:
    openai.api_key = settings.OPENAI_API_KEY

# Predefined categories for transaction classification
TRANSACTION_CATEGORIES = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Utilities",
    "Housing",
    "Insurance",
    "Education",
    "Travel",
    "Investment",
    "Salary",
    "Freelance",
    "Gifts",
    "Other"
]

async def categorize_transaction(description: str) -> Tuple[str, float]:
    """Use AI to categorize a transaction based on its description"""
    if not settings.OPENAI_API_KEY:
        # Fallback to simple keyword matching
        return _simple_categorization(description), 0.7
    
    try:
        prompt = f"""
        Categorize this transaction description into one of these categories:
        {', '.join(TRANSACTION_CATEGORIES)}
        
        Description: {description}
        
        Return only the category name.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial transaction categorizer. Return only the category name."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10,
            temperature=0.1
        )
        
        category = response.choices[0].message.content.strip()
        
        # Validate category
        if category not in TRANSACTION_CATEGORIES:
            category = "Other"
        
        return category, 0.9
        
    except Exception as e:
        print(f"AI categorization failed: {e}")
        return _simple_categorization(description), 0.5

def _simple_categorization(description: str) -> str:
    """Simple keyword-based categorization fallback"""
    description_lower = description.lower()
    
    # Food & Dining
    if any(word in description_lower for word in ['restaurant', 'food', 'dining', 'cafe', 'coffee', 'pizza', 'burger']):
        return "Food & Dining"
    
    # Transportation
    if any(word in description_lower for word in ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus']):
        return "Transportation"
    
    # Shopping
    if any(word in description_lower for word in ['amazon', 'walmart', 'target', 'shop', 'store', 'mall']):
        return "Shopping"
    
    # Entertainment
    if any(word in description_lower for word in ['netflix', 'spotify', 'movie', 'game', 'concert', 'theater']):
        return "Entertainment"
    
    # Healthcare
    if any(word in description_lower for word in ['doctor', 'hospital', 'pharmacy', 'medical', 'health']):
        return "Healthcare"
    
    # Utilities
    if any(word in description_lower for word in ['electric', 'water', 'gas', 'internet', 'phone', 'utility']):
        return "Utilities"
    
    # Housing
    if any(word in description_lower for word in ['rent', 'mortgage', 'home', 'apartment']):
        return "Housing"
    
    # Salary
    if any(word in description_lower for word in ['salary', 'payroll', 'income', 'deposit']):
        return "Salary"
    
    return "Other"

async def get_financial_insights(transactions: list) -> dict:
    """Generate AI-powered financial insights from transaction data"""
    if not settings.OPENAI_API_KEY:
        return {"message": "AI insights not available"}
    
    try:
        # Prepare transaction summary for AI
        transaction_summary = []
        for t in transactions[:50]:  # Limit to recent transactions
            transaction_summary.append(f"{t.category}: ${t.amount} - {t.description}")
        
        prompt = f"""
        Analyze these recent transactions and provide financial insights:
        
        Transactions:
        {'\n'.join(transaction_summary)}
        
        Provide insights on:
        1. Spending patterns
        2. Potential savings opportunities
        3. Budget recommendations
        4. Financial health assessment
        
        Format as JSON with keys: patterns, savings_opportunities, budget_recommendations, health_assessment
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial advisor. Provide insights in JSON format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.3
        )
        
        return {
            "insights": response.choices[0].message.content,
            "generated_at": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        print(f"AI insights generation failed: {e}")
        return {"message": "Unable to generate insights at this time"}

async def get_investment_recommendations(user_profile: dict) -> dict:
    """Generate AI-powered investment recommendations"""
    if not settings.OPENAI_API_KEY:
        return {"message": "AI recommendations not available"}
    
    try:
        prompt = f"""
        Based on this user profile, provide investment recommendations:
        
        Profile:
        - Monthly Income: ${user_profile.get('monthly_income', 0)}
        - Risk Tolerance: {user_profile.get('risk_tolerance', 'moderate')}
        - Investment Experience: {user_profile.get('investment_experience', 'beginner')}
        - Financial Goals: {user_profile.get('financial_goals', 'general savings')}
        
        Provide recommendations for:
        1. Asset allocation
        2. Investment vehicles
        3. Risk management
        4. Timeline considerations
        
        Format as JSON.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an investment advisor. Provide recommendations in JSON format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.3
        )
        
        return {
            "recommendations": response.choices[0].message.content,
            "generated_at": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        print(f"AI investment recommendations failed: {e}")
        return {"message": "Unable to generate recommendations at this time"} 