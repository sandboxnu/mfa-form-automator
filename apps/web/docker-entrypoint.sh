#!/bin/sh

# Replace the placeholder in nginx.conf with actual value
envsubst '${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
exec nginx -g 'daemon off;'
