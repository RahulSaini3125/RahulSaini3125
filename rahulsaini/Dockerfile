# Static site — no build step needed.

# Stage 1: pre-compress text assets so nginx serves the .gz files directly (gzip_static)
FROM alpine:3.20 AS compress
WORKDIR /site
COPY index.html favicon.svg ./
COPY assets ./assets
RUN find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' \) \
      -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;

# Stage 2: serve
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compress /site /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
