# Transformer-based QA
from transformers import pipeline

# Load transformer-based question-answering pipeline (DistilBERT fine-tuned on SQuAD)
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

def answer_query(question, user_context):
    """
    Uses transformer QA pipeline to answer finance-related questions.
    
    Args:
        question (str): User's natural language question.
        user_context (str): User's transaction history or financial context.

    Returns:
        str: Model-generated answer.
    """
    if not question.strip() or not user_context.strip():
        return "Please provide both a question and financial context."

    try:
        result = qa_pipeline({
            "context": user_context,
            "question": question
        })
        return result["answer"]
    except Exception as e:
        return f"Sorry, I couldn't process your query: {str(e)}"