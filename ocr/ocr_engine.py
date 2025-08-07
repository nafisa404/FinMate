# OCR logic
import pytesseract
from PIL import Image
import cv2
import numpy as np

def preprocess_image(image: Image.Image):
    """
    Convert image to grayscale and apply thresholding for better OCR.
    """
    img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return Image.fromarray(thresh)

def extract_text_from_image(image: Image.Image):
    """
    Runs Tesseract OCR on the input image.

    Returns:
        str: Raw text extracted from the receipt image.
    """
    preprocessed = preprocess_image(image)
    text = pytesseract.image_to_string(preprocessed)
    return text