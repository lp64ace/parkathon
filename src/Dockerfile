FROM python:3.9-alpine as python-code

WORKDIR /app

RUN apk add --no-cache gcc g++ musl-dev python3-dev libffi-dev libc-dev

COPY requirements.txt .

RUN python3 -m venv /venv
RUN /venv/bin/pip install --upgrade pip setuptools wheel && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PATH="/venv/bin:$PATH"

EXPOSE 9001
CMD ["python", "app.py"]
