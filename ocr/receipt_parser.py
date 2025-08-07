# Receipt extraction logic
from models.categorizer import predict_category
from utils.formatter import extract_amount, extract_date
from .ocr_engine import extract_text_from_image

def extract_receipt_data(image):
    """
    Parses vendor, date, amount, and category from receipt image using OCR + ML.

    Returns:
        dict: Extracted structured receipt data.
    """
    raw_text = extract_text_from_image(image)
    lines = raw_text.strip().split("\n")
    lines = [line.strip() for line in lines if line.strip()]
    
    vendor = lines[0] if lines else "Unknown Vendor"
    amount = extract_amount(raw_text)
    date = extract_date(raw_text)
    category = predict_category(raw_text)

    return {
        "vendor": vendor,
        "amount": amount,
        "date": date,
        "category": category,
        "raw_text": raw_text
    }