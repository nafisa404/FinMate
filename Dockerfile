# Docker instructions
# Step 1: Use official Python image
FROM python:3.8-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies for Tesseract OCR
RUN apt-get update && \
    apt-get install -y tesseract-ocr libglib2.0-0 libsm6 libxext6 libxrender-dev && \
    apt-get clean

# Step 4: Copy project files
COPY . /app

# Step 5: Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Expose Streamlit default port
EXPOSE 8501

# Step 7: Set environment variables (disable telemetry & caching)
ENV PYTHONUNBUFFERED=1 \
    STREAMLIT_BROWSER_GATHER_USAGE_STATS=false \
    STREAMLIT_SERVER_HEADLESS=true

# Step 8: Run the boot script to create database and seed sample data
RUN python boot.py

# Step 9: Launch the app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.enableCORS=false"]
