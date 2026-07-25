FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Data is fetched from Catalyst Data Store at runtime — no local data needed.

EXPOSE 8080

CMD ["python", "main.py"]
