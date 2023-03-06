FROM python:3.11.x

WORKDIR /app
COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt
COPY . .

EXPOSE 5000

# CMD ["uvicorn", "app.main:app", "--host",  "0.0.0.0", "--reload"]

# If running behind a proxy like Nginx or Traefik add --proxy-headers
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--reload", "--proxy-headers"]
