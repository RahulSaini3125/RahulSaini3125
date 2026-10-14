/*
 * Resume builder — turns window.PROFILE (data.js) into a downloadable one-page PDF.
 * Loaded on demand by main.js the first time someone clicks "Download CV",
 * together with assets/js/vendor/jspdf.umd.min.js and the fonts in assets/fonts/.
 *
 * ATS-friendly by design:
 *  - one reading column of real, selectable text; contact details in the body, not a page header
 *  - embedded fonts (Inter, Space Grotesk) carry a Unicode map, so parsers extract exact text
 *  - standard section headings: Summary, Skills, Experience, Projects, Education
 *  - decoration (top band, logo, bullets, separators) is drawn as vector shapes, never as
 *    text glyphs, so nothing stray ends up in the parsed text
 *  - each line is written as whole strings with real spaces, so words never get glued together
 * Everything comes from data.js — edit that, not this.
 *
 * One page: if the content overflows, it is rebuilt with slightly smaller type and
 * spacing (down to MIN_SCALE). Past that it would spill onto page 2 — trim data.js.
 */
(function (root) {
  'use strict';

  const PAGE = { w: 595.28, h: 841.89 }; // A4 in points
  const M = { x: 46, top: 50, bottom: 38 };
  const W = PAGE.w - M.x * 2;
  const MIN_SCALE = 0.82;
  const C = {
    ink: [17, 24, 39],
    body: [55, 65, 81],
    muted: [107, 114, 128],
    faint: [203, 207, 214],
    accent: [91, 72, 214],
    teal: [20, 184, 166],
    violet: [139, 92, 246],
    pink: [236, 72, 153],
  };

  const FONTS = [
    { file: 'Inter-Regular.ttf', family: 'Inter', style: 'normal' },
    { file: 'Inter-SemiBold.ttf', family: 'Inter', style: 'bold' },
    { file: 'Inter-Italic.ttf', family: 'Inter', style: 'italic' },
    { file: 'SpaceGrotesk-Bold.ttf', family: 'SpaceGrotesk', style: 'bold' },
  ];

  // Fetch the TTFs (same origin) as base64 for jsPDF. Missing fonts fall back to Helvetica.
  async function loadFonts(base) {
    const toB64 = (buf) => {
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(bin);
    };
    const out = {};
    await Promise.all(
      FONTS.map(async (f) => {
        try {
          const r = await fetch(base + f.file);
          if (r.ok) out[f.file] = toB64(await r.arrayBuffer());
        } catch (e) { /* fall back */ }
      })
    );
    return out;
  }

  // Keep text plain: drop markdown stars, emoji and arrows; typographic dashes/quotes become ASCII.
  function clean(s) {
    return String(s ?? '')
      .replace(/\*\*/g, '')
      .replace(/\s*·\s*/g, ' | ')
      .replace(/[–—→↗]/g, '-')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/…/g, '...')
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const host = (url) => String(url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

  function render(P, fonts, k) {
    const { jsPDF } = root.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    const s = (n) => n * k;
    let y = M.top;

    // Register embedded fonts; fall back to the built-in Helvetica if any is missing.
    const have = FONTS.every((f) => fonts && fonts[f.file]);
    if (have) {
      FONTS.forEach((f) => {
        doc.addFileToVFS(f.file, fonts[f.file]);
        doc.addFont(f.file, f.family, f.style);
      });
    }
    const BODY = have ? 'Inter' : 'helvetica';
    const DISPLAY = have ? 'SpaceGrotesk' : 'helvetica';

    const font = (style, size, color, family = BODY) => {
      doc.setFont(family, family === DISPLAY && have ? 'bold' : style);
      doc.setFontSize(size);
      doc.setTextColor(...(color || C.ink));
    };
    const lineH = (size) => size * 1.36;
    const ensure = (h) => {
      if (y + h > PAGE.h - M.bottom) {
        doc.addPage();
        y = M.top;
      }
    };

    // Word-wrapped text made of styled runs. Lines after the first start at `hang`.
    // Each line is drawn as few strings as possible, spaces included, so ATS reads it cleanly.
    function runs(parts, { size = s(9.6), x = M.x, width = W, hang = x, after = 0 } = {}) {
      const words = [];
      parts.forEach((p) => {
        clean(p.text).split(' ').filter(Boolean).forEach((w) => words.push({ w, style: p.style || 'normal', color: p.color || C.body, link: p.link }));
      });
      const right = x + width;
      const lines = [[]];
      let cx = x;
      words.forEach((t) => {
        font(t.style, size);
        const line = lines[lines.length - 1];
        const lead = line.length ? doc.getTextWidth(' ') : 0;
        const ww = doc.getTextWidth(t.w);
        if (line.length && cx + lead + ww > right) {
          lines.push([t]);
          cx = hang + ww;
        } else {
          line.push(t);
          cx += lead + ww;
        }
      });

      const lh = lineH(size);
      lines.forEach((line, li) => {
        ensure(lh);
        const segs = [];
        line.forEach((t, i) => {
          const last = segs[segs.length - 1];
          const text = (i ? ' ' : '') + t.w;
          if (last && last.style === t.style && last.color === t.color && last.link === t.link) last.text += text;
          else segs.push({ ...t, text });
        });
        let sx = li ? hang : x;
        segs.forEach((g) => {
          font(g.style, size, g.color);
          if (g.link) {
            const lead = g.text.startsWith(' ') ? ' ' : '';
            if (lead) { doc.text(lead, sx, y); sx += doc.getTextWidth(lead); }
            doc.textWithLink(g.text.slice(lead.length), sx, y, { url: g.link });
            sx += doc.getTextWidth(g.text.slice(lead.length));
          } else {
            doc.text(g.text, sx, y);
            sx += doc.getTextWidth(g.text);
          }
        });
        y += lh;
      });
      y += after;
    }

    // Accent marker + heading + hairline rule running to the right edge.
    function section(title) {
      ensure(s(42));
      y += s(9);
      const size = s(11);
      font('bold', size, C.ink, DISPLAY);
      const t = clean(title).toUpperCase();
      doc.setFillColor(...C.accent);
      doc.roundedRect(M.x, y - size * 0.72, 3, size * 0.78, 1, 1, 'F');
      doc.text(t, M.x + 9, y);
      const tw = doc.getTextWidth(t);
      doc.setDrawColor(...C.faint);
      doc.setLineWidth(0.6);
      doc.line(M.x + 9 + tw + 8, y - size * 0.32, M.x + W, y - size * 0.32);
      y += s(13);
    }

    function titleRow(title, size = s(10.6)) {
      ensure(lineH(size) * 3); // keep the title with its org line
      runs([{ text: title, style: 'bold', color: C.ink }], { size });
    }

    function bullet(text) {
      ensure(lineH(s(9.6)));
      doc.setFillColor(...C.accent);
      doc.circle(M.x + 4.5, y - s(3.2), s(1.35), 'F');
      runs([{ text }], { x: M.x + 14, hang: M.x + 14, width: W - 14, after: s(1.6) });
    }

    // Items on one line separated by small vector dots (no separator glyphs in the text).
    function contactLine(items, size) {
      const gap = s(8);
      font('normal', size);
      const space = doc.getTextWidth(' ');
      let sx = M.x;
      items.forEach((c, i) => {
        if (i) {
          // centre the dot in the gap made of the previous item's trailing space + `gap`
          doc.setFillColor(...C.violet);
          doc.circle(sx - space + (space + gap) / 2, y - size * 0.33, 1.1, 'F');
          sx += gap;
        }
        font('normal', size, C.body);
        const t = clean(c.text) + (i < items.length - 1 ? ' ' : ''); // trailing space keeps items apart in extraction
        if (c.link) doc.textWithLink(t, sx, y, { url: c.link });
        else doc.text(t, sx, y);
        sx += doc.getTextWidth(t);
      });
      y += lineH(size);
    }

    // The </> mark from favicon.svg, drawn as strokes (64-unit viewBox).
    function logo(x, top, size) {
      const u = size / 64;
      const P2 = (px, py) => [x + px * u, top + py * u];
      doc.setLineCap('round');
      doc.setLineJoin('round');
      doc.setLineWidth(6 * u);
      const poly = (pts, color) => {
        doc.setDrawColor(...color);
        for (let i = 1; i < pts.length; i++) doc.line(...P2(...pts[i - 1]), ...P2(...pts[i]));
      };
      poly([[18, 16], [4, 32], [18, 48]], C.teal);
      poly([[38, 12], [26, 52]], C.violet);
      poly([[46, 16], [60, 32], [46, 48]], C.pink);
      doc.setLineCap('butt');
    }

    /* ---------- Top band: teal -> violet -> pink ---------- */
    const steps = 90;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const col = t < 0.55 ? mix(C.teal, C.violet, t / 0.55) : mix(C.violet, C.pink, (t - 0.55) / 0.45);
      doc.setFillColor(...col);
      doc.rect((PAGE.w / steps) * i, 0, PAGE.w / steps + 0.5, 6, 'F');
    }

    /* ---------- Header ---------- */
    const logoSize = s(40);
    logo(M.x + W - logoSize, y - s(10), logoSize);
    font('bold', s(26), C.ink, DISPLAY);
    doc.text(clean(P.name), M.x, y + s(10));
    y += s(28);
    font('bold', s(11.5), C.accent);
    doc.text(clean(P.role), M.x, y);
    y += s(18);

    const line1 = [];
    if (P.email) line1.push({ text: P.email, link: `mailto:${P.email}` });
    if (P.phone) line1.push({ text: P.phone, link: `tel:${P.phone.replace(/[^\d+]/g, '')}` });
    if (P.address) line1.push({ text: [P.address.locality, P.address.region, 'India'].filter(Boolean).join(', ') });
    const line2 = [];
    if (P.siteUrl) line2.push({ text: host(P.siteUrl), link: P.siteUrl });
    ['linkedin', 'github'].forEach((icon) => {
      const so = (P.socials || []).find((x) => x.icon === icon);
      if (so) line2.push({ text: host(so.url), link: so.url });
    });
    if (line1.length) contactLine(line1, s(9.2));
    if (line2.length) contactLine(line2, s(9.2));
    y += s(2);

    /* ---------- Summary ---------- */
    if (P.intro) {
      section('Summary');
      runs([{ text: P.intro }], { after: s(1) });
    }

    /* ---------- Skills: "Group: items" on one line each ---------- */
    // (A separate label column would be parsed as its own column: all labels first, then all items.)
    if ((P.skills || []).length) {
      section('Skills');
      P.skills.forEach((g) => runs([{ text: `${g.group}:`, style: 'bold', color: C.ink }, { text: (g.items || []).join(', ') }], { after: s(1.4) }));
    }

    // "Org | Mohali | Full-time | Mar 2024 - Present" — dates inline rather than right-aligned,
    // so ATS keeps them attached to the right entry.
    const orgLine = (e) => {
      const parts = [{ text: e.org, style: 'italic', color: C.accent }];
      const when = [e.start, e.end].filter(Boolean).join(' - ');
      if (when) parts.push({ text: '|', color: C.faint }, { text: when, color: C.muted });
      runs(parts, { size: s(9.4) });
    };

    /* ---------- Experience ---------- */
    const jobs = (P.experience || []).filter((e) => e.type === 'work');
    if (jobs.length) {
      section('Experience');
      jobs.forEach((j) => {
        titleRow(j.title);
        orgLine(j);
        y += s(1.5);
        (j.points || []).forEach(bullet);
        y += s(3);
      });
    }

    /* ---------- Projects: "Title | stack" then description ---------- */
    if ((P.projects || []).length) {
      section('Projects');
      P.projects.forEach((p) => {
        ensure(lineH(s(9.8)) * 2);
        const head = [{ text: p.title, style: 'bold', color: C.ink }];
        if ((p.tags || []).length) head.push({ text: '|', color: C.faint }, { text: p.tags.join(', '), color: C.accent });
        runs(head, { size: s(9.6) });
        runs([{ text: p.description }], { after: s(4.5) });
      });
    }

    /* ---------- Education ---------- */
    const edu = (P.experience || []).filter((e) => e.type === 'education');
    if (edu.length) {
      section('Education');
      edu.forEach((e) => {
        titleRow(e.title, s(10.2));
        orgLine(e);
        y += s(3);
      });
    }

    doc.setProperties({
      title: `${clean(P.name)} - Resume`,
      subject: clean(P.role),
      author: clean(P.name),
      keywords: (P.skills || []).flatMap((g) => g.items || []).join(', '),
      creator: host(P.siteUrl) || 'Portfolio resume builder',
    });
    return doc;
  }

  // Shrink step by step until everything fits on one page.
  function build(P, fonts) {
    let doc;
    for (let k = 1; k >= MIN_SCALE - 1e-9; k -= 0.02) {
      doc = render(P, fonts, k);
      if (doc.getNumberOfPages() === 1) return doc;
    }
    if (root.console) console.warn('Resume does not fit on one page even at minimum size - trim data.js.');
    return doc;
  }

  root.ResumeBuilder = {
    loadFonts,
    build,
    fileName: (P) => `${clean(P.name).replace(/\s+/g, '-')}-Resume.pdf`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
