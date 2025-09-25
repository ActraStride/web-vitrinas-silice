FROM ghcr.io/library/nginx:alpine

COPY public /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
USER 101
