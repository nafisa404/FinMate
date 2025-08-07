# Rupee formatting function
import re
from datetime import datetime

def extract_amount(text):
    matches = re.findall(r"(?:₹|Rs\.?|INR)?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)", text)
    if matches:
        return float(matches[-1].replace(',', ''))
    return 0.0

def extract_date(text):
    matches = re.findall(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", text)
    for date_str in matches:
        for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%m/%d/%Y", "%d/%m/%y"):
            try:
                return datetime.strptime(date_str, fmt).date()
            except:
                continue
    return None
