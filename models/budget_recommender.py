# KMeans for budget
import pandas as pd
from sklearn.cluster import KMeans
import numpy as np

def recommend_budget(transactions_df):
    """
    Suggests a monthly budget based on user spending clusters.

    Args:
        transactions_df (DataFrame): User's transactions with 'amount' and 'category'.

    Returns:
        dict: Recommended monthly budget by category.
    """
    df = transactions_df.copy()
    df = df[df['amount'] > 0]

    pivot = df.pivot_table(values='amount', index='category', aggfunc='sum').fillna(0)
    pivot = pivot.reset_index()

    model = KMeans(n_clusters=3, random_state=42)
    pivot['cluster'] = model.fit_predict(pivot[['amount']])

    avg_cluster = pivot.groupby('cluster')['amount'].mean().idxmax()
    recommended = pivot[pivot['cluster'] == avg_cluster][['category', 'amount']]

    budget = {}
    for _, row in recommended.iterrows():
        budget[row['category']] = round(row['amount'], 2)

    return budget