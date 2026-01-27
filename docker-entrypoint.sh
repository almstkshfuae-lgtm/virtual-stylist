#!/bin/sh
set -e

# Replace $PORT in nginx.conf with the actual environment variable value
# Cloud Run defaults to 8080 if not set.
export PORT=${PORT:-8080}

envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
