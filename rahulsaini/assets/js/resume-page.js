/*
 * HTML resume page (served at /resume/), built from PROFILE.
 * Used by tools/prerender at build time (fully baked HTML for crawlers) and by
 * resume-app.js in the browser when there is no build (local dev).
 *
 * Why it exists: the "Download CV" PDF is generated in the browser, so search engines and AI
 * answer engines never see it. This page is the crawlable version — semantic HTML with one
 * <h1>, section <h2>s, real links and JSON-LD that reuses the homepage's Person node — and it
 * links to the static PDF that prerender.mjs writes at /<Name>-Resume.pdf.
 *
 * Inline CSS and the site's own fonts; JSON-LD is a data block, not an executable script.
 * Plain ES module with no imports, so Node and the browser can both load it.
 */

// Must match ResumeBuilder.fileName() in resume.js
export const resumePdfName = (P) => `${String(P.name).trim().replace(/\s+/g, '-')}-Resume.pdf`;

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const plain = (s) => String(s ?? '').replace(/\*\*/g, '');
const host = (u) => String(u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// "Mar 2024" -> "2024-03", "2021" -> "2021"; anything else (e.g. "Present") -> no datetime
const MONTHS = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
function time(label) {
  const m = String(label || '').match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (m && MONTHS[m[1].toLowerCase()]) return `<time datetime="${m[2]}-${MONTHS[m[1].toLowerCase()]}">${esc(label)}</time>`;
  if (/^\d{4}$/.test(label || '')) return `<time datetime="${label}">${esc(label)}</time>`;
  return esc(label);
}
const range = (e) => [e.start, e.end].filter(Boolean).map(time).join(' – ');

export function resumePage(P, person, pdfName = resumePdfName(P)) {
  const url = P.siteUrl;
  const pageUrl = `${url}resume/`;
  const title = `${P.name} – Resume | ${P.role}`;
  const description = `Resume of ${P.name}, ${P.role} in ${P.address?.locality || ''}, India. ${plain(P.intro)}`.replace(/\s+/g, ' ').trim();
  const jobs = (P.experience || []).filter((e) => e.type !== 'education');
  const edu = (P.experience || []).filter((e) => e.type === 'education');
  const social = (icon) => (P.socials || []).find((s) => s.icon === icon);
  const image = new URL(P.shareImage || 'assets/img/og-image.png', url).href + '?v=2';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: 'en',
        dateModified: new Date().toISOString().slice(0, 10),
        isPartOf: { '@id': `${url}#website` },
        mainEntity: { '@id': `${url}#person` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        associatedMedia: { '@type': 'MediaObject', contentUrl: `${url}${pdfName}`, encodingFormat: 'application/pdf', name: `${P.name} – Resume (PDF)` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: P.name, item: url },
          { '@type': 'ListItem', position: 2, name: 'Resume', item: pageUrl },
        ],
      },
      ...(person ? [person] : []),
    ],
  };

  const contacts = [
    P.email && `<li><a href="mailto:${esc(P.email)}">${esc(P.email)}</a></li>`,
    P.phone && `<li><a href="tel:${esc(P.phone.replace(/[^\d+]/g, ''))}">${esc(P.phone)}</a></li>`,
    P.address && `<li>${esc([P.address.locality, P.address.region, 'India'].join(', '))}</li>`,
    url && `<li><a href="${esc(url)}">${esc(host(url))}</a></li>`,
    social('linkedin') && `<li><a href="${esc(social('linkedin').url)}" rel="me">${esc(host(social('linkedin').url))}</a></li>`,
    social('github') && `<li><a href="${esc(social('github').url)}" rel="me">${esc(host(social('github').url))}</a></li>`,
  ].filter(Boolean);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="author" content="${esc(P.name)}" />
  <meta name="robots" content="index, follow, max-snippet:-1" />
  <link rel="canonical" href="${esc(pageUrl)}" />
  <link rel="alternate" type="application/pdf" href="${esc(url + pdfName)}" title="${esc(P.name)} – Resume (PDF)" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(pageUrl)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="profile:first_name" content="${esc(P.name.split(' ')[0])}" />
  <meta property="profile:last_name" content="${esc(P.name.split(' ').slice(1).join(' '))}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  <meta name="theme-color" content="#ffffff" />
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  <!-- "Download PDF" builds the PDF in the browser; its href is the prebuilt file for crawlers / no-JS -->
  <script src="../assets/js/data.js" defer></script>
  <script type="module" src="../assets/js/resume-app.js?v=2"></script>
  <style>
    @font-face { font-family: Inter; src: url(../assets/fonts/Inter-Regular.ttf) format('truetype'); font-weight: 400; font-display: swap; }
    @font-face { font-family: Inter; src: url(../assets/fonts/Inter-SemiBold.ttf) format('truetype'); font-weight: 600; font-display: swap; }
    @font-face { font-family: Inter; src: url(../assets/fonts/Inter-Italic.ttf) format('truetype'); font-style: italic; font-display: swap; }
    @font-face { font-family: 'Space Grotesk'; src: url(../assets/fonts/SpaceGrotesk-Bold.ttf) format('truetype'); font-weight: 700; font-display: swap; }
    :root { --ink: #111827; --body: #374151; --muted: #6b7280; --rule: #e5e7eb; --accent: #5b48d6; --bg: #f4f5f8; --paper: #fff; }
    @media (prefers-color-scheme: dark) {
      :root { --ink: #f3f4f6; --body: #d1d5db; --muted: #9ca3af; --rule: #2b3140; --accent: #a99bff; --bg: #07090d; --paper: #10141c; }
    }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 12px; }
    ::-webkit-scrollbar-track { background: color-mix(in srgb, var(--bg) 85%, var(--accent) 15%); }
    ::-webkit-scrollbar-thumb { border-radius: 999px; border: 3px solid transparent; background-clip: padding-box;
      background-image: linear-gradient(180deg, #14b8a6, #8b5cf6 55%, #ec4899); }
    ::-webkit-scrollbar-thumb:hover { border-width: 2px; }
    @supports (-moz-appearance: none) { html { scrollbar-width: thin; scrollbar-color: #8b5cf6 transparent; } }
    body { margin: 0; background: var(--bg); color: var(--body); font: 15px/1.6 Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; }
    a { color: inherit; text-decoration-color: color-mix(in srgb, currentColor 35%, transparent); text-underline-offset: 3px; }
    a:hover { color: var(--accent); }
    .top { max-width: 860px; margin: 0 auto; padding: 20px 16px 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 14px; }
    .top a { text-decoration: none; color: var(--muted); }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 999px; font-weight: 600; text-decoration: none;
      color: #fff !important; background: linear-gradient(90deg, #14b8a6, #8b5cf6 55%, #ec4899); }
    .btn[aria-busy="true"] { opacity: .7; cursor: progress; }
    .paper { max-width: 860px; margin: 16px auto 48px; background: var(--paper); border-radius: 18px; overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 12px 40px rgba(17,24,39,.08); }
    .paper::before { content: ''; display: block; height: 6px; background: linear-gradient(90deg, #14b8a6, #8b5cf6 55%, #ec4899); }
    .inner { padding: 40px 48px 44px; }
    header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
    h1 { font: 700 40px/1.05 'Space Grotesk', Inter, sans-serif; color: var(--ink); margin: 0; letter-spacing: -.02em; }
    .role { color: var(--accent); font-weight: 600; font-size: 17px; margin: 6px 0 10px; }
    .contact { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 4px 0; font-size: 14px; }
    .contact li:not(:last-child)::after { content: '•'; color: var(--accent); margin: 0 10px; }
    .logo { width: 52px; height: 52px; flex: none; }
    h2 { display: flex; align-items: center; gap: 10px; font: 700 15px 'Space Grotesk', Inter, sans-serif; letter-spacing: .04em; text-transform: uppercase;
      color: var(--ink); margin: 30px 0 12px; }
    h2::before { content: ''; width: 4px; height: 15px; border-radius: 2px; background: var(--accent); }
    h2::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
    h3 { font-size: 16px; color: var(--ink); margin: 0; font-weight: 600; }
    p { margin: 0; }
    .skills { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
    .skills strong { color: var(--ink); font-weight: 600; }
    .entry + .entry { margin-top: 16px; }
    .meta { font-size: 14px; color: var(--muted); margin: 2px 0 6px; }
    .meta em { color: var(--accent); }
    .entry ul { margin: 6px 0 0; padding-left: 20px; }
    .entry li { margin: 4px 0; }
    .entry li::marker { color: var(--accent); }
    .stack { font-size: 14px; color: var(--accent); }
    .stack span { color: var(--muted); }
    @media (max-width: 640px) {
      .inner { padding: 28px 20px 32px; }
      h1 { font-size: 32px; }
      .logo { width: 40px; height: 40px; }
    }
    @media print {
      body { background: #fff; font-size: 12px; }
      .top { display: none; }
      .paper { margin: 0; box-shadow: none; border-radius: 0; }
      .inner { padding: 24px 28px; }
      a { text-decoration: none; }
    }
  </style>
</head>
<body>
  <nav class="top" aria-label="Resume actions">
    <a href="../">← ${esc(host(url))}</a>
    <a class="btn" href="../${esc(pdfName)}" download data-resume="auto">Download PDF</a>
  </nav>
  <main class="paper">
    <div class="inner">
      <header>
        <div>
          <h1>${esc(P.name)}</h1>
          <p class="role">${esc(P.role)}</p>
          <ul class="contact">${contacts.join('')}</ul>
        </div>
        <svg class="logo" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <g fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 16 4 32l14 16" stroke="#14b8a6"/><path d="M38 12 26 52" stroke="#8b5cf6"/><path d="M46 16l14 16-14 16" stroke="#ec4899"/>
          </g>
        </svg>
      </header>

      <section aria-labelledby="summary">
        <h2 id="summary">Summary</h2>
        <p>${esc(plain(P.intro))}</p>
      </section>

      <section aria-labelledby="skills">
        <h2 id="skills">Skills</h2>
        <ul class="skills">
${(P.skills || []).map((g) => `          <li><strong>${esc(g.group)}:</strong> ${esc(g.items.map((s) => (typeof s === 'string' ? s : s.name)).join(', '))}</li>`).join('\n')}
        </ul>
      </section>

      <section aria-labelledby="experience">
        <h2 id="experience">Experience</h2>
${jobs.map((j) => `        <article class="entry">
          <h3>${esc(j.title)}</h3>
          <p class="meta"><em>${esc(j.org)}</em> | ${range(j)}</p>
          <ul>
${(j.points || []).map((p) => `            <li>${esc(plain(p))}</li>`).join('\n')}
          </ul>
        </article>`).join('\n')}
      </section>

      <section aria-labelledby="projects">
        <h2 id="projects">Projects</h2>
${(P.projects || []).map((p) => `        <article class="entry">
          <h3>${esc(p.title)}</h3>
          <p>${esc(plain(p.description))}</p>
          ${(p.tags || []).length ? `<p class="stack"><span>Stack:</span> ${esc(p.tags.join(', '))}</p>` : ''}
        </article>`).join('\n')}
      </section>

      <section aria-labelledby="education">
        <h2 id="education">Education</h2>
${edu.map((e) => `        <article class="entry">
          <h3>${esc(e.title)}</h3>
          <p class="meta"><em>${esc(e.org)}</em> | ${range(e)}</p>
        </article>`).join('\n')}
      </section>
    </div>
  </main>
</body>
</html>
`;
}
