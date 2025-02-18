FROM node:18-alpine as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:18-alpine as frontend-serve

WORKDIR /app
COPY --from=frontend-build /app/dist /app/dist

RUN npm install -g serve

ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]