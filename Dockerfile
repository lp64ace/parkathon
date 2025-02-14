FROM node:18-alpine
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .
# Expose the port that React app will use (default 80)
EXPOSE 80

# Build the React app for production
# RUN npm run build
# Command to run the app
CMD ["node", "index.js"]