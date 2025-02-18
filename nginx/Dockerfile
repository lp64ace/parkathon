FROM nginx:alpine

RUN mkdir -p /etc/nginx/certs

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY generate_cert.sh /etc/nginx/

RUN chmod +x /etc/nginx/generate_cert.sh

RUN apk add --no-cache openssl

RUN /etc/nginx/generate_cert.sh
