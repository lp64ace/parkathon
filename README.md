# Parkathon

How to deploy with docker

```
docker build -t parkathon .
docker run -e VITE_GOOGLE_MAPS_API_KEY="..." -p 80:80 parkathon
```
