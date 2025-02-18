FROM node:18-alpine as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]