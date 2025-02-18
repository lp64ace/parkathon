FROM node:18-alpine as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:18-alpine as frontend-serve

WORKDIR /app
COPY --from=frontend-build /app/build /app/build

RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]