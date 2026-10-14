# Static site — the only build step is prerendering the content into the HTML for SEO.

# Stage 1: prerender — bake the JS-rendered content into index.html, generate sitemap.xml + llms.txt
FROM node:24-alpine AS prerender
WORKDIR /tools
COPY tools/prerender/package.json tools/prerender/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY tools/prerender/prerender.mjs ./
WORKDIR /site
COPY index.html 404.html favicon.svg robots.txt ./
COPY assets ./assets
COPY nginx.conf /tools/nginx.conf
RUN node /tools/prerender.mjs /site /tools/nginx.conf

# Stage 2: pre-compress text assets so nginx serves the .gz files directly (gzip_static)
FROM alpine:3.20 AS compress
COPY --from=prerender /site /site
WORKDIR /site
RUN find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' -o -name '*.txt' -o -name '*.xml' \) \
      -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;

# Stage 3: serve
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compress /site /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
