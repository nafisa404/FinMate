#!/usr/bin/env python3
"""
Simple test script for FinMate Backend

This script tests basic functionality of the backend API.
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Is it running?")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("🔍 Testing root endpoint...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint working: {data.get('message', 'Unknown')}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False

def test_documentation():
    """Test if documentation is available"""
    print("🔍 Testing documentation...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ API documentation is available")
            return True
        else:
            print(f"❌ Documentation not available: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False

def test_registration():
    """Test user registration"""
    print("🔍 Testing user registration...")
    
    test_user = {
        "email": f"test_{datetime.now().timestamp()}@example.com",
        "username": f"testuser_{int(datetime.now().timestamp())}",
        "password": "testpassword123",
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/register",
            json=test_user
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ User registration successful")
            print(f"   Token: {data.get('access_token', 'No token')[:20]}...")
            return data.get('access_token')
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return None

def test_login():
    """Test user login"""
    print("🔍 Testing user login...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=login_data
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            return data.get('access_token')
        else:
            print(f"❌ Login failed: {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return None

def test_protected_endpoint(token):
    """Test a protected endpoint"""
    if not token:
        print("❌ No token provided for protected endpoint test")
        return False
    
    print("🔍 Testing protected endpoint...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Protected endpoint working")
            print(f"   User: {data.get('email', 'Unknown')}")
            return True
        else:
            print(f"❌ Protected endpoint failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False

def test_transactions_endpoint(token):
    """Test transactions endpoint"""
    if not token:
        print("❌ No token provided for transactions test")
        return False
    
    print("🔍 Testing transactions endpoint...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(
            f"{API_BASE}/transactions/",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Transactions endpoint working")
            print(f"   Found {len(data)} transactions")
            return True
        else:
            print(f"❌ Transactions endpoint failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False

def main():
    """Run all tests"""
    print("🧪 FinMate Backend Test Suite")
    print("=" * 40)
    
    # Test basic connectivity
    if not test_health_check():
        print("❌ Server is not running or not accessible")
        return
    
    if not test_root_endpoint():
        print("❌ Basic API functionality failed")
        return
    
    if not test_documentation():
        print("❌ Documentation not available")
        return
    
    print("\n📝 Testing authentication...")
    
    # Try to register a new user
    token = test_registration()
    
    # If registration fails, try login
    if not token:
        print("🔄 Trying login with existing user...")
        token = test_login()
    
    if token:
        print("\n🔐 Testing authenticated endpoints...")
        test_protected_endpoint(token)
        test_transactions_endpoint(token)
    else:
        print("❌ Authentication tests failed")
    
    print("\n✅ Test suite completed!")
    print(f"📚 API Documentation: {BASE_URL}/docs")
    print(f"🔗 Health Check: {BASE_URL}/health")

if __name__ == "__main__":
    main() 