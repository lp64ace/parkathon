# Build frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install js-cookie
COPY frontend/ ./
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

# Build backend
FROM node:18-alpine as backend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build Python service
FROM python:3.9-slim as python-build
WORKDIR /app/python
COPY lib/prediction/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY lib/prediction/ .

# Final stage
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY --from=backend-build /app /app

# Copy built frontend files
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy Python service files
COPY --from=python-build /app/python /app/python

# Install serve to host the frontend
RUN npm install -g serve

# Expose the ports for frontend, backend, and Python service
EXPOSE 80
EXPOSE 9000
EXPOSE 9001

# Command to run the app (backend, frontend, and Python service)
CMD ["sh", "-c", "node index.js & serve -s frontend/dist -l 80 & python /app/python/app.py"]
