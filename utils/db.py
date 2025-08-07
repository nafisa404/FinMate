# Handles DB functions
import sqlite3
import bcrypt
import pandas as pd

DB_PATH = "data/database.db"

def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False)

def validate_user(username, password):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT password FROM users WHERE username=?", (username,))
    result = cur.fetchone()
    return result and bcrypt.checkpw(password.encode(), result[0])

def create_user(username, password):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT username FROM users WHERE username=?", (username,))
    if cur.fetchone():
        return False
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
    conn.commit()
    return True

def get_user_transactions(username):
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM transactions WHERE username = ?", conn, params=(username,))
    return df

def get_tax_related_expenses(username):
    df = get_user_transactions(username)
    summary = {
        "80C": df[df["category"].str.lower().str.contains("elss|ppf|life insurance", na=False)]["amount"].sum(),
        "80D": df[df["category"].str.lower().str.contains("medical|health insurance", na=False)]["amount"].sum()
    }
    return summary

def get_ious(username, mode="owed_to_me"):
    conn = get_connection()
    return pd.read_sql_query("SELECT * FROM ious WHERE username=? AND direction=?", conn, params=(username, mode))

def add_iou(username, name, amount, direction, note=""):
    conn = get_connection()
    conn.execute("INSERT INTO ious (username, name, amount, direction, note) VALUES (?, ?, ?, ?, ?)",
                 (username, name, amount, direction, note))
    conn.commit()
