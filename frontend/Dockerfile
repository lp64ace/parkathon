FROM node:18-alpine as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build
