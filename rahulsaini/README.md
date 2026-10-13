# Rahul Saini — Developer Profile

Static personal profile website (HTML + CSS + vanilla JS, no build step).

## Edit your content

All text lives in **`assets/js/data.js`**. Replace every `[placeholder]` value with your own details:
experience, projects, skills, services, socials. Optional: add a photo (`photo`) and CV (`resume`) under `assets/`.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

- **Docker / Nginx:** `docker compose up -d --build`
- **Any static host** (GitHub Pages, Netlify, Vercel, Cloudflare Pages): publish this folder as-is.

When you change CSS/JS, bump the `?v=` number in `index.html` so browsers fetch the new files.
