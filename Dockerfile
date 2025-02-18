# =============================
# 1. Build frontend
# =============================
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install js-cookie
COPY frontend/ ./
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

# =============================
# 2. Build backend
# =============================
FROM node:18-alpine as backend-build
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . .

# =============================
# 3. Prepare Python Service Code (Alpine-based)
# =============================
FROM python:3.9-alpine as python-code
WORKDIR /app/python

# Install required Alpine packages for building dependencies
RUN apk add --no-cache gcc g++ musl-dev python3-dev libffi-dev libc-dev

# Copy Python requirements and source code
COPY lib/prediction/requirements.txt . 
COPY lib/prediction/ . 

# =============================
# 4. Final Stage - Merge Everything
# =============================
FROM node:18-alpine
WORKDIR /app

# Install Python and necessary dependencies
RUN apk add --no-cache python3 py3-pip gcc g++ musl-dev python3-dev libffi-dev libc-dev

# Copy backend files
COPY --from=backend-build /app /app

# Copy built frontend files
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy Python service files (without venv)
COPY --from=python-code /app/python /app/python

# Create virtual environment in the final container (this fixes the missing Python issue)
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel && \
    /venv/bin/pip install --no-cache-dir -r /app/python/requirements.txt

# Set environment variables to ensure venv is used
ENV PATH="/venv/bin:$PATH"

# Install serve to host the frontend
RUN npm install -g serve

# Expose ports for frontend, backend, and Python service
EXPOSE 80 9000 9001

# Command to run everything
CMD ["sh", "-c", "node index.js & serve -s frontend/dist -l 80 & python /app/python/app.py"]