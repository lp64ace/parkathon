# Build frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

FROM node:18-alpine
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Copy built frontend files
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Install serve to host the frontend
RUN npm install -g serve

# Expose the ports for frontend and backend
EXPOSE 80
EXPOSE 9000

# Command to run the app (backend and frontend)
CMD ["sh", "-c", "node index.js & serve -s frontend/dist -l 80"]
