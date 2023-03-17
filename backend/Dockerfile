FROM python:3.10
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV FLASK_APP=app.py
ENV FLASK_DEBUG=false
ENV PORT=5000

RUN pip install gunicorn

ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
# ENTRYPOINT ["flask", "run"]
