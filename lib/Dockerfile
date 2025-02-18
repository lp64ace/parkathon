FROM node:18-alpine as backend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 9000
CMD ["node", "index.js"]
