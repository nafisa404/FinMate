#!/usr/bin/env python3
"""
Simple test script for FinMate application
This script tests that all modules can be imported and basic functionality works
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported"""
    print("🧪 Testing module imports...")
    
    try:
        # Test main app
        from app import FinMateApp
        print("✅ Main app imported successfully")
        
        # Test all modules
        from src.auth import AuthManager
        print("✅ Auth module imported successfully")
        
        from src.dashboard import Dashboard
        print("✅ Dashboard module imported successfully")
        
        from src.expense_tracker import ExpenseTracker
        print("✅ Expense tracker module imported successfully")
        
        from src.subscription_detox import SubscriptionDetox
        print("✅ Subscription detox module imported successfully")
        
        from src.wallet_chat import WalletChat
        print("✅ Wallet chat module imported successfully")
        
        from src.investment_tracker import InvestmentTracker
        print("✅ Investment tracker module imported successfully")
        
        from src.learning_modules import LearningModules
        print("✅ Learning modules imported successfully")
        
        from src.personality_profiler import PersonalityProfiler
        print("✅ Personality profiler module imported successfully")
        
        from src.ai_journal import AIJournal
        print("✅ AI journal module imported successfully")
        
        # Test utilities
        from utils import format_currency, calculate_percentage_change
        print("✅ Utils module imported successfully")
        
        # Test config
        from config import Config
        print("✅ Config module imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_basic_functionality():
    """Test basic functionality of modules"""
    print("\n🧪 Testing basic functionality...")
    
    try:
        # Test utility functions
        from utils import format_currency, calculate_percentage_change
        
        # Test currency formatting
        formatted = format_currency(1234.56)
        assert formatted == "$1,234.56", f"Expected $1,234.56, got {formatted}"
        print("✅ Currency formatting works")
        
        # Test percentage change calculation
        change = calculate_percentage_change(100, 120)
        assert change == 20.0, f"Expected 20.0, got {change}"
        print("✅ Percentage change calculation works")
        
        # Test module instantiation
        from src.dashboard import Dashboard
        dashboard = Dashboard()
        print("✅ Dashboard instantiation works")
        
        from src.expense_tracker import ExpenseTracker
        expense_tracker = ExpenseTracker()
        print("✅ Expense tracker instantiation works")
        
        from src.wallet_chat import WalletChat
        wallet_chat = WalletChat()
        print("✅ Wallet chat instantiation works")
        
        return True
        
    except Exception as e:
        print(f"❌ Functionality test error: {e}")
        return False

def test_config():
    """Test configuration loading"""
    print("\n🧪 Testing configuration...")
    
    try:
        from config import Config
        
        # Test config validation
        Config.validate_config()
        print("✅ Configuration validation works")
        
        # Test AI config
        ai_config = Config.get_ai_config()
        assert isinstance(ai_config, dict), "AI config should be a dictionary"
        print("✅ AI configuration works")
        
        # Test API config
        api_config = Config.get_api_config()
        assert isinstance(api_config, dict), "API config should be a dictionary"
        print("✅ API configuration works")
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting FinMate application tests...\n")
    
    # Test imports
    imports_ok = test_imports()
    
    # Test basic functionality
    functionality_ok = test_basic_functionality()
    
    # Test configuration
    config_ok = test_config()
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY")
    print("="*50)
    
    if imports_ok and functionality_ok and config_ok:
        print("🎉 ALL TESTS PASSED!")
        print("✅ FinMate application is ready to run")
        print("\nTo start the application, run:")
        print("streamlit run app.py")
    else:
        print("❌ SOME TESTS FAILED")
        print("Please check the errors above and fix them")
    
    print("="*50)

if __name__ == "__main__":
    main() 