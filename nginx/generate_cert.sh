openssl req -x509 -newkey rsa:4096 \
  -keyout /etc/nginx/certs/server.key \
  -out /etc/nginx/certs/server.crt \
  -days 365 \
  -nodes \
  -subj "/CN=localhost"