# FinMate Documentation
# 💸 FinMate: AI-Powered Personal Finance Tracker

[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://hub.docker.com/)
[![Streamlit](https://img.shields.io/badge/streamlit-deployed-brightgreen.svg)](https://streamlit.io)

FinMate is a privacy-first, AI/ML-enhanced personal finance tracker that runs completely **offline**. It helps users:

- 🧠 Understand their spending habits
- 🧾 Scan receipts with OCR
- 💸 Track income, expenses, IOUs
- 📊 Visualize financial health
- 📉 Get AI budget + investment tips
- 🎮 Gamify financial discipline

---

## 🧰 Tech Stack

| Component   | Tech                                      |
|------------|-------------------------------------------|
| Frontend   | Streamlit (Python)                        |
| Backend    | Python 3.8+, SQLite (local-first)         |
| ML/NLP     | scikit-learn, NLTK, TextBlob              |
| OCR        | Tesseract OCR + pytesseract               |
| Charts     | Plotly, Matplotlib, Seaborn               |
| Auth       | bcrypt password hashing                   |

---

## 🚀 Features

- 🤖 AI Chatbot + Smart Receipt Scanner
- 🧾 OCR Parsing + Auto Categorization
- 📈 Budget Alerts + IOU Tracker
- 📊 Real-Time Dashboard + Gamified Reports
- 🧠 Behavioral Spending Classifier (KMeans)
- 🧮 Tax Planner + Investment Tracker
- 🔐 Secure login + Fully Offline

---

## 🧪 Local Setup

```bash
git clone https://github.com/yourusername/finmate.git
cd finmate

python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

pip install -r requirements.txt

# Run setup script
python boot.py

# Launch the app
streamlit run app.py
🔐 Demo Login
username: demo_user
password: demo123

🐳 Docker Deployment
bash
Copy
Edit
# Build container
docker build -t finmate .

# Run container
docker run -p 8501:8501 finmate
📂 Folder Structure
kotlin
Copy
Edit
finmate/
├── app.py
├── boot.py
├── requirements.txt
├── Dockerfile
├── pages/
├── chatbot/
├── models/
├── ocr/
├── utils/
├── data/
└── assets/
📊 Sample Data
Included in data/database.db with:

Transactions

IOUs

Demo user

Journal history

Use DB Browser for SQLite or integrate with Streamlit table viewers.

🛡️ Security
All user data stays local

bcrypt hashing for password storage

SQL injection protected

Streamlit session state login