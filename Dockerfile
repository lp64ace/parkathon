# Build frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
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

# Expose the port that React app will use (default 80)
EXPOSE 80

# Command to run the app
CMD ["sh", "-c", "node index.js & serve -s frontend/dist -l 80"]