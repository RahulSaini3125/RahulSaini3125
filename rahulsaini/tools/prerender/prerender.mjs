/*
 * Prerender: runs data.js + main.js against index.html once (in jsdom) and writes the result
 * back, so search engines, AI crawlers and link previews get the full content without JS.
 * Also generates sitemap.xml and llms.txt from the same profile data.
 *
 *   node tools/prerender/prerender.mjs <site-dir> [nginx.conf]
 *
 * Rewrites files inside <site-dir>. With nginx.conf, also checks that its Content-Security-Policy
 * allows every inline script's sha256, and fails (printing the hash) if it doesn't.
 *
 * The browser still runs main.js as usual and re-renders the same content on top.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const site = process.argv[2];
if (!site) { console.error('usage: node prerender.mjs <site-dir>'); process.exit(1); }

const file = join(site, 'index.html');
const dom = new JSDOM(readFileSync(file, 'utf8'), {
  url: 'https://www.officialrahulsaini.in/',
  runScripts: 'outside-only', // only the scripts eval'd below; the inline theme script stays untouched
  pretendToBeVisual: true,
});
const { window } = dom;
const { document } = window;

// Browser APIs jsdom lacks. The no-op IntersectionObserver keeps reveal animations un-triggered,
// so they still play for real visitors.
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

for (const src of ['assets/js/data.js', 'assets/js/main.js']) {
  window.eval(readFileSync(join(site, src), 'utf8'));
}
const P = window.PROFILE;

// Undo state that only makes sense live: typing effect (the #rotator-label already holds
// every role for crawlers and screen readers), clocks, scroll styles
for (const id of ['rotator', 'clock', 'contact-clock', 'contact-mood']) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}
for (const id of ['progress', 'rail-fill']) document.getElementById(id)?.removeAttribute('style');
document.querySelector('.nav')?.classList.remove('scrolled');
document.querySelector('noscript')?.remove(); // content is in the HTML now

writeFileSync(file, dom.serialize());
window.close();

// ---------- CSP check: inline scripts must be allowed by hash ----------
const nginxConf = process.argv[3];
if (nginxConf) {
  const conf = readFileSync(nginxConf, 'utf8');
  const html = readFileSync(file, 'utf8');
  const missing = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`)
    .filter((h) => !conf.includes(h));
  if (missing.length) {
    console.error(`nginx.conf Content-Security-Policy is missing ${missing.join(' ')} — update script-src.`);
    process.exit(1);
  }
}

// ---------- sitemap.xml ----------
const url = P.siteUrl;
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(site, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`);

// ---------- llms.txt (https://llmstxt.org) — a plain-text profile for AI assistants ----------
const plain = (s) => String(s ?? '').replace(/\*\*/g, '');
const lines = [
  `# ${P.name}`,
  '',
  `> ${P.name} is a ${P.role} based in ${P.address ? `${P.address.locality}, ${P.address.region}, India` : P.location}.`,
  '',
  plain(P.intro),
  '',
  ...(P.about || []).map(plain).flatMap((p) => [p, '']),
  '## Experience',
  '',
  ...(P.experience || []).flatMap((e) => [
    `- **${e.title}**, ${e.org} (${e.start} – ${e.end})`,
    ...(e.points || []).map((p) => `  - ${p}`),
  ]),
  '',
  '## Projects',
  '',
  ...(P.projectsNote ? [P.projectsNote, ''] : []),
  ...(P.projects || []).map((p) => `- **${p.title}**: ${p.description} Stack: ${(p.tags || []).join(', ')}.`),
  '',
  '## Skills',
  '',
  ...(P.skills || []).map((g) => `- **${g.group}**: ${g.items.map((s) => (typeof s === 'string' ? s : s.name)).join(', ')}`),
  '',
  '## FAQ',
  '',
  ...(P.faq || []).flatMap((f) => [`### ${f.q}`, '', f.a, '']),
  '## Links',
  '',
  `- [Website](${url})`,
  ...(P.socials || []).map((s) => `- [${s.label}](${s.url})`),
  ...(P.email ? [`- Email: ${P.email}`] : []),
  '',
];
writeFileSync(join(site, 'llms.txt'), lines.join('\n'));

console.log(`prerendered ${file}, sitemap.xml, llms.txt`);
