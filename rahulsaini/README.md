# Rahul Saini — Developer Profile

Static personal profile website (HTML + CSS + vanilla JS). The only build step is an optional prerender for SEO.

**Live:** https://www.officialrahulsaini.in/

## Edit content

All text lives in **`assets/js/data.js`** — profile, availability (`available`), experience, projects,
skills, services, FAQ, contact starters and socials. Optional: add a photo (`photo`) and CV (`resume`) under `assets/`.

Each entry in `socials` has a `url` (the link visitors click, e.g. `https://x.officialrahulsaini.in`, which
redirects via Nginx Proxy Manager) and a `profile` (the real profile URL, published as `sameAs` in the
structured data so search engines tie the profile to the site).

The intro video above Contact comes from `video` in `data.js` (`assets/video/intro.mp4` + poster). Keep the
file web-sized (it's ~10 MB, loaded only when played); set `video: ''` to hide the section. There's a light cut
(`video.light`) that's shown in light mode, and `video.chapters` lists the jump points beside the player.
The player has no download button or context menu, and `nginx.conf` returns 403 for the `.mp4` files unless the
request comes from the site's own pages — this stops casual saving, but isn't DRM.

`available: false` hides the Services section and hire-me buttons; flip it to `true` (and update the
availability answer in `faq`) when you're open to work.

## SEO, GEO & AEO

- **Prerendered HTML** — the Docker build runs `tools/prerender/prerender.mjs`, which executes `data.js` +
  `main.js` once and writes the result into `index.html`, so search engines, AI crawlers and link previews
  see the full content without running JavaScript.
- **Structured data** — `main.js` builds JSON-LD (`Person`, `ProfilePage`, `WebSite`, `FAQPage`) from `data.js`.
- **FAQ** — visible Q&A section that answer engines can quote; edit `faq` in `data.js`.
- **`llms.txt` + `sitemap.xml`** — generated at build time from `data.js`. `robots.txt` allows search and AI crawlers.
- **Social preview** — `assets/img/og-image.png` (1200×630).
- **Google Search Console** — verified with `google6d08cbae026a9347.html`; keep that file or the site loses verification.

After deploying, submit `https://www.officialrahulsaini.in/sitemap.xml` in Google Search Console and Bing
Webmaster Tools, and check the structured data with Google's Rich Results Test.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

- **Docker / Nginx:** `docker compose up -d --build` — runs behind Nginx Proxy Manager (forward to `rahulsaini-portfolio:80`); the container redirects the bare domain to `www`.
- **Any static host** (GitHub Pages, Netlify, Vercel, Cloudflare Pages): publish this folder as-is (the site
  works without prerendering), or publish an SEO build made in a separate folder — never prerender the
  source files in place:

  ```bash
  rm -rf build && mkdir build && cp -R index.html 404.html favicon.svg robots.txt google*.html assets build/
  (cd tools/prerender && npm ci) && node tools/prerender/prerender.mjs build   # publish build/
  ```

When you change `style.css` or `main.js`, bump the `?v=` number in `index.html` so browsers fetch the new
files. `data.js` is always revalidated, so content edits show up without a bump.

If you edit the inline theme script in `index.html`, the Docker build will fail and print the new sha256
to paste into the `Content-Security-Policy` in `nginx.conf`.
