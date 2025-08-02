#!/usr/bin/env python3
"""
FinMate Backend Startup Script

This script helps initialize the database and start the application.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python version
    if sys.version_info < (3, 11):
        print("❌ Python 3.11+ is required")
        return False
    
    # Check if required packages are installed
    required_packages = [
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "psycopg2-binary",
        "pydantic",
        "pydantic-settings"
    ]
    
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
        except ImportError:
            print(f"❌ Missing package: {package}")
            print("Run: pip install -r requirements.txt")
            return False
    
    print("✅ All dependencies are installed")
    return True

def setup_environment():
    """Set up environment variables"""
    print("🔧 Setting up environment...")
    
    env_file = Path(".env")
    if not env_file.exists():
        example_env = Path("env.example")
        if example_env.exists():
            print("📝 Creating .env file from template...")
            with open(example_env, "r") as f:
                content = f.read()
            
            with open(env_file, "w") as f:
                f.write(content)
            
            print("✅ .env file created. Please edit it with your configuration.")
            return False
        else:
            print("❌ env.example file not found")
            return False
    
    print("✅ Environment file exists")
    return True

def setup_database():
    """Set up the database"""
    print("🗄️ Setting up database...")
    
    # Check if PostgreSQL is running
    try:
        result = subprocess.run("pg_isready", shell=True, capture_output=True)
        if result.returncode != 0:
            print("❌ PostgreSQL is not running. Please start PostgreSQL first.")
            return False
    except FileNotFoundError:
        print("❌ PostgreSQL client not found. Please install PostgreSQL.")
        return False
    
    # Create database if it doesn't exist
    print("📊 Creating database...")
    try:
        subprocess.run("createdb finmate", shell=True, check=False)
        print("✅ Database created or already exists")
    except Exception as e:
        print(f"⚠️ Could not create database: {e}")
    
    # Run migrations
    if not run_command("alembic upgrade head", "Running database migrations"):
        return False
    
    return True

def start_application():
    """Start the FastAPI application"""
    print("🚀 Starting FinMate Backend...")
    
    # Set default port
    port = os.getenv("PORT", "8000")
    
    print(f"🌐 Application will be available at: http://localhost:{port}")
    print(f"📚 API documentation will be available at: http://localhost:{port}/docs")
    print("⏹️ Press Ctrl+C to stop the application")
    print("-" * 50)
    
    # Start the application
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", port,
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
    except Exception as e:
        print(f"❌ Failed to start application: {e}")

def main():
    """Main startup function"""
    print("💰 FinMate Backend Startup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("app").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("⚠️ Please configure your .env file and run again")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        sys.exit(1)
    
    # Start application
    start_application()

if __name__ == "__main__":
    main() 