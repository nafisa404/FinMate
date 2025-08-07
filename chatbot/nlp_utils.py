# NLP helpers
import re
from textblob import TextBlob

def extract_entities(text):
    """
    Extract common financial entities such as amounts and dates.

    Args:
        text (str): OCR or chatbot input text.

    Returns:
        dict: Extracted entities.
    """
    amounts = re.findall(r"(?:₹|Rs\.?|INR)?\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?", text)
    dates = re.findall(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", text)
    return {"amounts": amounts, "dates": dates}

def detect_sentiment(text):
    """
    Analyze sentiment of the input using TextBlob.

    Returns:
        polarity (float): -1 (negative) to +1 (positive)
        subjectivity (float): 0 (objective) to 1 (subjective)
    """
    blob = TextBlob(text)
    return blob.sentiment.polarity, blob.sentiment.subjectivity

def clean_input(text):
    """
    Basic text cleaning for NLP pipelines.

    Args:
        text (str): User input or scanned OCR text.

    Returns:
        str: Cleaned lowercase text.
    """
    text = re.sub(r"[^a-zA-Z0-9\s₹.,:/-]", "", text)
    return text.lower().strip()