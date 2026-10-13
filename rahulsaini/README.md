# Rahul Saini — Developer Profile

Static personal profile website (HTML + CSS + vanilla JS, no build step).

**Live:** https://www.officialrahulsaini.in/

## Edit content

All text lives in **`assets/js/data.js`** — profile, availability (`available`), experience, projects,
skills, services, contact starters and socials. Optional: add a photo (`photo`) and CV (`resume`) under `assets/`.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

- **Docker / Nginx:** `docker compose up -d --build` — runs behind Nginx Proxy Manager (forward to `rahulsaini-portfolio:80`); the container redirects the bare domain to `www`.
- **Any static host** (GitHub Pages, Netlify, Vercel, Cloudflare Pages): publish this folder as-is.

When you change CSS/JS, bump the `?v=` number in `index.html` so browsers fetch the new files.
