(function () {
  'use strict';

  const P = window.PROFILE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Run at most once per animation frame, using the latest event
  const perFrame = (fn) => {
    let queued = false, last;
    return (e) => {
      last = e;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; fn(last); });
    };
  };

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const tags = (list) =>
    list && list.length ? `<div class="tags">${list.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : '';

  const ICONS = {
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>',
    email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    website: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  };

  /* ---------- Experience duration ---------- */
  function experience() {
    const m = /^(\d{4})-(\d{2})$/.exec(P.careerStart || '');
    if (!m) return '—';
    const start = new Date(+m[1], +m[2] - 1, 1);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (months < 12) return `${Math.max(months, 1)} mo`;
    const years = Math.floor((months / 12) * 2) / 2; // round down to nearest half year
    return `${years}+ yrs`;
  }

  /* ---------- Simple bindings ---------- */
  function bindSimple() {
    $$('[data-bind]').forEach((el) => (el.textContent = P[el.dataset.bind] ?? ''));
    $$('[data-if]').forEach((el) => { if (!P[el.dataset.if]) el.remove(); });
    $$('[data-if-not]').forEach((el) => { if (P[el.dataset.ifNot]) el.remove(); });
    $$('[data-href]').forEach((el) => el.setAttribute('href', P[el.dataset.href]));
    $$('[data-src]').forEach((el) => el.setAttribute('src', P[el.dataset.src]));

    if (P.name) document.title = `${P.name} — ${P.role || 'Developer'}`;
    $('#year').textContent = new Date().getFullYear();
    $('#mail-btn').href = `mailto:${P.email}`;
  }

  /* ---------- Sections ---------- */
  function renderSocials() {
    const list = (P.socials || []).concat(P.email ? [{ icon: 'email', label: 'Email', url: `mailto:${P.email}` }] : []);
    $('#socials').innerHTML = list
      .map((s) => `<li><a href="${esc(s.url)}" ${s.icon === 'email' ? '' : 'target="_blank" rel="noopener"'} aria-label="${esc(s.label)}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.icon] || ICONS.website}</svg></a></li>`)
      .join('');
    $('#contact-links').innerHTML = (P.socials || [])
      .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener"><span>${esc(s.label)}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`)
      .join('');
  }

  function renderOrbit() {
    const items = P.orbit || [];
    $('#orbit').innerHTML = items
      .map((t, i) => `<span class="chip-orbit" style="--i:${i};--n:${items.length}"><span>${esc(t)}</span></span>`)
      .join('');
  }

  function renderCode() {
    const c = P.codeCard || {};
    const arr = (a) => `[${(a || []).map((v) => `<span class="c-s">"${esc(v)}"</span>`).join(', ')}]`;
    const key = (k) => `  <span class="c-p">${k}</span>: `;
    $('#code-card').innerHTML =
      `<code><span class="c-k">const</span> <span class="c-v">${esc((P.handle || 'me').split('.')[0])}</span> = {\n` +
      `${key('focus')}${arr(c.focus)},\n` +
      `${key('stack')}${arr(c.stack)},\n` +
      `${key('openTo')}<span class="c-s">"${esc(c.openTo)}"</span>,\n};</code>`;
  }

  function renderStats() {
    $('#stats').innerHTML = (P.stats || [])
      .map((s, i) => `<div class="stat reveal" style="--d:${i * 80}ms"><dt>${esc(s.label)}</dt><dd>${esc(s.value === 'auto' ? experience() : s.value)}</dd></div>`)
      .join('');
  }

  function renderMarquee() {
    const all = (P.skills || []).flatMap((g) => g.items.map((s) => (typeof s === 'string' ? s : s.name)));
    if (!all.length) { $('.marquee')?.remove(); return; }
    const row = (items) => {
      const html = items.map((s) => `<span class="marquee__item">${esc(s)}<i>✦</i></span>`).join('');
      return html + html; // duplicated for a seamless loop
    };
    const half = Math.ceil(all.length / 2);
    $('#marquee-1').innerHTML = row(all.length > 6 ? all.slice(0, half) : all);
    $('#marquee-2').innerHTML = row(all.length > 6 ? all.slice(half) : all.slice().reverse());
  }

  // "**text**" → highlighted text (input is escaped first)
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="hl">$1</strong>');

  function careerSince() {
    const m = /^(\d{4})-(\d{2})$/.exec(P.careerStart || '');
    return m ? new Date(+m[1], +m[2] - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  }

  function renderAbout() {
    $('#about-text').innerHTML = (P.about || []).map((p, i) => `<p class="${i === 0 ? 'lead' : ''}">${rich(p)}</p>`).join('');

    $('#facts').innerHTML = (P.facts || [])
      .map((f) => {
        const value = f.value === 'auto' ? `${experience()}${careerSince() ? ` <small>since ${careerSince()}</small>` : ''}` : esc(f.value);
        return `<div class="fact"><span class="fact__icon" aria-hidden="true">${esc(f.icon)}</span><dt>${esc(f.label)}</dt><dd>${value}</dd></div>`;
      })
      .join('');

    $('#highlights').innerHTML = (P.highlights || [])
      .map((h, i) => `<li class="highlight glow-card reveal" style="--d:${i * 80}ms">
          <span class="highlight__icon" aria-hidden="true">${esc(h.icon)}</span>
          <h4>${esc(h.title || '')}</h4>
          <p>${esc(h.text)}</p>
        </li>`)
      .join('');
  }

  function renderExperience() {
    $('#timeline').innerHTML = (P.experience || [])
      .map((e) => {
        const current = /present/i.test(e.end || '');
        const badge = e.type === 'education'
          ? '<span class="badge">Education</span>'
          : current ? '<span class="badge badge--live">Current</span>' : '<span class="badge">Work</span>';
        const points = e.points && e.points.length ? `<ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : '';
        return `<li class="job reveal ${current ? 'job--current' : ''}">
          <span class="job__dot" aria-hidden="true"></span>
          <div class="job__card glow-card">
            <div class="job__meta"><span class="job__date">${esc(e.start)} — ${esc(e.end)}</span>${badge}</div>
            <h3>${esc(e.title)}</h3>
            <p class="job__company">${esc(e.org)}</p>
            ${points}${tags(e.tags)}
          </div>
        </li>`;
      })
      .join('');
  }

  function renderProjects() {
    $('#project-grid').innerHTML = (P.projects || [])
      .map((p, i) => {
        const live = /prod|live/i.test(p.badge || '');
        const nda = /nda|confidential/i.test(p.badge || '');
        const points = p.points && p.points.length ? `<ul class="card__points">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
        const link = p.link ? `<a class="card__link" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>` : '';
        return `<article class="card glow-card ${i === 0 ? 'card--feature' : ''} ${p.wide ? 'card--wide' : ''} reveal" id="project-${slug(p.title)}" style="--d:${(i % 3) * 90}ms">
          <div class="card__top">
            <span class="card__icon" aria-hidden="true">${esc(p.icon)}</span>
            <div class="card__top-right">${p.badge ? `<span class="badge ${live ? 'badge--live' : ''} ${nda ? 'badge--nda' : ''}">${esc(p.badge)}</span>` : ''}${link}</div>
          </div>
          <span class="card__index mono">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          ${points}${tags(p.tags)}
        </article>`;
      })
      .join('');
  }

  /* ---------- Skills board ---------- */
  const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
  // Path ending in .svg = logo (Devicon, or local when it starts with assets/); anything else is shown as-is (emoji / symbol).
  const SKILL_ICONS = {
    'python': 'python/python-original.svg', 'fastapi': 'fastapi/fastapi-original.svg',
    'django': 'django/django-plain.svg', 'django rest': 'DRF',
    'node.js': 'nodejs/nodejs-original.svg', 'javascript': 'javascript/javascript-original.svg',
    'typescript': 'typescript/typescript-original.svg', 'react': 'react/react-original.svg',
    'next.js': 'nextjs/nextjs-original.svg', 'tailwind css': 'tailwindcss/tailwindcss-original.svg',
    'html5': 'html5/html5-original.svg', 'css3': 'css3/css3-original.svg',
    'postgresql': 'postgresql/postgresql-original.svg', 'redis': 'redis/redis-original.svg',
    'docker': 'docker/docker-original.svg', 'nginx': 'nginx/nginx-original.svg',
    'linux': 'linux/linux-original.svg', 'git': 'git/git-original.svg',
    'azure': 'azure/azure-original.svg', 'aws': 'amazonwebservices/amazonwebservices-original-wordmark.svg',
    'ci/cd': 'githubactions/githubactions-original.svg', 'websockets': 'socketio/socketio-original.svg',
    'langchain': '🦜', 'langgraph': '⛓️', 'crewai': '👥', 'rag': '📚', 'openai': '✨', 'claude': '✳️',
    'agentic ai': '🤖', 'embeddings': '🧬', 'vector dbs': 'assets/img/milvus.svg',
    'prompt engineering': '💬', 'rest apis': '🔌', 'xml / soap': '🧾',
    'cron jobs': '⏰', 'celery': '🥬', 'aws lambda': 'assets/img/lambda.svg',
    'step functions': 'assets/img/step-functions.svg', 'eventbridge': 'assets/img/eventbridge.svg', 'ecs': '📦',
  };

  function skillIcon(name, custom) {
    const icon = custom || SKILL_ICONS[name.toLowerCase()];
    if (icon && /\.svg$/.test(icon)) {
      const src = /^(https?:|assets\/)/.test(icon) ? icon : DEVICON + icon;
      return `<img src="${esc(src)}" alt="" width="36" height="36" loading="lazy" decoding="async" data-fallback="${esc(name.slice(0, 2))}">`;
    }
    const text = icon || name.slice(0, 2);
    return `<span class="skill__glyph ${text.length > 2 ? 'skill__glyph--sm' : ''}">${esc(text)}</span>`;
  }

  /* ---------- Skills: atoms ---------- */
  const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const GROUP_HUES = ['var(--a2)', 'var(--a1)', 'var(--a3)', 'var(--a4)', 'var(--a5)'];

  function renderSkills() {
    const groups = P.skills || [];
    const root = $('#atoms');
    if (!root) return;
    if (!groups.length) { root.remove(); return; }

    // Tools orbit on two rings: a small inner ring and a larger outer one
    const ring = (list, offset, cls) => list.length ? `<div class="ring ${cls}">${list.map(({ name, k }, j) =>
      `<span class="orb" data-k="${k}" style="--a:${(j / list.length) * 360 + offset}deg"><span class="orb__in" title="${esc(name)}">${skillIcon(name)}</span></span>`).join('')}</div>` : '';

    root.innerHTML = groups.map((g, gi) => {
      const items = g.items.map((it, k) => ({ name: typeof it === 'string' ? it : it.name, k }));
      const nInner = items.length <= 4 ? items.length : Math.round(items.length * 0.4);
      return `
        <article class="atom-card reveal ${gi === 0 ? 'atom-card--feature' : ''}" style="--hue:${GROUP_HUES[gi % GROUP_HUES.length]};--d:${gi * 80}ms">
          <header class="atom-card__head mono"><span>${String(gi + 1).padStart(2, '0')}</span><span>${items.length} tools</span></header>
          <div class="atom" aria-hidden="true">
            ${ring(items.slice(0, nInner), -90, 'ring--1')}
            ${ring(items.slice(nInner), -90 + 180 / Math.max(1, items.length - nInner), 'ring--2')}
            <div class="atom__core"><span class="atom__num mono">${esc(g.num ?? '')}</span><span class="atom__sym">${esc(g.sym || g.group.slice(0, 2))}</span></div>
          </div>
          <div class="atom-card__body">
            <h3 class="atom-card__title">${esc(g.group)}</h3>
            <p class="atom-card__desc">${esc(g.desc || '')}</p>
            <ul class="atom-card__tools">${items.map(({ name, k }) => `<li data-k="${k}">${esc(name)}</li>`).join('')}</ul>
          </div>
        </article>`;
    }).join('');

    $$('img', root).forEach((img) => img.addEventListener('error', () => {
      img.outerHTML = `<span class="skill__glyph">${esc(img.dataset.fallback)}</span>`;
    }, { once: true }));

    // Hovering a tool name lights up its logo in the orbit
    const hot = (e, on) => {
      const li = e.target.closest('.atom-card__tools li'); if (!li) return;
      const orb = $(`.orb[data-k="${li.dataset.k}"]`, li.closest('.atom-card'));
      if (orb) orb.classList.toggle('is-hot', on);
    };
    root.addEventListener('pointerover', (e) => hot(e, true));
    root.addEventListener('pointerout', (e) => hot(e, false));
  }

  const SERVICE_SCENES = {
    ai: `
      <div class="scene scene--ai">
        <div class="bubble bubble--user">What's our refund window?</div>
        <div class="bubble bubble--typing"><i></i><i></i><i></i></div>
        <div class="bubble bubble--bot">30 days from delivery, full refund.<span class="bubble__src">policy.pdf · p.4</span></div>
      </div>`,
    web: `
      <div class="scene scene--web">
        <div class="browser">
          <div class="browser__bar"><i></i><i></i><i></i><span>app.yourproduct.com</span></div>
          <div class="browser__body">
            <div class="browser__side"><b></b><b></b><b></b><b></b></div>
            <div class="browser__main">
              <div class="browser__kpi"><span>Revenue</span><strong>+24%</strong></div>
              <div class="browser__chart">${[40, 62, 48, 75, 58, 90].map((h, k) => `<b style="--h:${h}%;--k:${k}"></b>`).join('')}</div>
            </div>
          </div>
        </div>
      </div>`,
    cloud: `
      <div class="scene scene--cloud">
        <div class="pipe">
          <span class="pipe__node">API</span><span class="pipe__node">Queue</span><span class="pipe__node">λ</span><span class="pipe__node">DB</span>
          <span class="pipe__packet" aria-hidden="true"></span>
        </div>
        <div class="pipe__log"><span class="pipe__ok">201</span> POST /orders · 42ms<span class="pipe__deploy">● deployed</span></div>
      </div>`,
  };

  function renderServices() {
    if (!$('#service-list')) return; // section hidden while not available
    $('#service-list').innerHTML = (P.services || [])
      .map((s, i) => {
        const subject = encodeURIComponent(`Project enquiry: ${s.title}`);
        return `<article class="service glow-card reveal" style="--d:${i * 90}ms">
          <div class="service__scene" aria-hidden="true">${SERVICE_SCENES[s.kind] || ''}</div>
          <div class="service__head"><span class="service__num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3></div>
          <p>${esc(s.text)}</p>
          ${s.deliverables ? `<ul class="service__gets" aria-label="What you get">${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
          ${s.idealFor ? `<p class="service__fit"><span>Ideal for</span>${esc(s.idealFor)}</p>` : ''}
          <a class="service__cta" href="mailto:${esc(P.email)}?subject=${subject}">Discuss this <span aria-hidden="true">→</span></a>
        </article>`;
      })
      .join('');

    const steps = P.process || [];
    if (!steps.length) { $('#process')?.remove(); return; }
    $('#process').innerHTML = steps
      .map((p, i) => `<li class="process__step" style="--i:${i}"><span class="process__dot">${i + 1}</span><h4>${esc(p.step)}</h4><p>${esc(p.text)}</p></li>`)
      .join('');
  }

  /* ---------- FAQ ---------- */
  function renderFaq() {
    const list = $('#faq-list');
    if (!list) return;
    const faq = P.faq || [];
    if (!faq.length) { $('#faq')?.remove(); return; }
    list.innerHTML = faq
      .map((f, i) => `<details class="faq__item glow-card reveal" style="--d:${(i % 3) * 60}ms"${i === 0 ? ' open' : ''}>
          <summary><h3>${esc(f.q)}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
          <p>${esc(f.a)}</p>
        </details>`)
      .join('');
  }

  // Section numbers follow what's actually on the page (Services is hidden while unavailable)
  function numberSections() {
    $$('main .section__head[data-num]').forEach((h, i) => (h.dataset.num = String(i + 1).padStart(2, '0')));
  }

  /* ---------- Structured data (JSON-LD) for search and AI answer engines ---------- */
  function renderSchema() {
    const url = P.siteUrl || location.origin + '/';
    const abs = (path) => (path ? new URL(path, url).href : undefined);
    const plain = (s) => String(s).replace(/\*\*/g, '');
    const person = {
      '@type': 'Person',
      '@id': `${url}#person`,
      name: P.name,
      url,
      image: abs(P.photo || P.shareImage),
      jobTitle: P.role,
      description: P.intro,
      email: P.email ? `mailto:${P.email}` : undefined,
      address: P.address ? { '@type': 'PostalAddress', addressLocality: P.address.locality, addressRegion: P.address.region, addressCountry: P.address.country } : undefined,
      worksFor: P.company ? { '@type': 'Organization', name: P.company.name } : undefined,
      alumniOf: P.school ? { '@type': 'CollegeOrUniversity', name: P.school } : undefined,
      knowsAbout: [...new Set((P.skills || []).flatMap((g) => g.items.map((s) => (typeof s === 'string' ? s : s.name))))],
      sameAs: (P.socials || []).map((s) => s.url),
    };
    const graph = [
      { '@type': 'WebSite', '@id': `${url}#website`, url, name: P.name, inLanguage: 'en', publisher: { '@id': `${url}#person` } },
      {
        '@type': 'ProfilePage', '@id': `${url}#profile`, url, name: document.title,
        description: (P.about || []).map(plain).join(' '),
        isPartOf: { '@id': `${url}#website` }, mainEntity: { '@id': `${url}#person` },
      },
      person,
    ];
    if ((P.faq || []).length) {
      graph.push({
        '@type': 'FAQPage', '@id': `${url}#faq`, url: `${url}#faq`,
        mainEntity: P.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      });
    }
    let el = $('#schema');
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'schema';
      document.head.appendChild(el);
    }
    // undefined fields drop out; "<" is escaped so data can never close the script tag
    el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  }

  /* ---------- Rotating headline word ---------- */
  function setupRotator() {
    const el = $('#rotator');
    const words = (P.roles || []).filter(Boolean);
    if (!words.length) return;
    // The typing effect is hidden from screen readers; they get the full list once instead
    $('#rotator-label').textContent = words.length > 1
      ? `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`
      : words[0];
    if (reduceMotion || words.length === 1) { el.textContent = words[0]; return; }

    let w = 0, c = 0, deleting = false, timer = 0, visible = true;
    const tick = () => {
      timer = 0;
      if (!visible || document.hidden) return; // resumed by resume()
      const word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let delay = deleting ? 35 : 70;
      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      timer = setTimeout(tick, delay);
    };
    const resume = () => { if (!timer && visible && !document.hidden) tick(); };
    onVisibility($('.hero'), (v) => { visible = v; resume(); });
    document.addEventListener('visibilitychange', resume);
    tick();
  }

  /* ---------- Off-screen work ---------- */
  // One shared observer; callbacks fire when an element enters/leaves the viewport (with margin)
  const watchers = new Map();
  const viewport = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((en) => (watchers.get(en.target) || []).forEach((cb) => cb(en.isIntersecting))), { rootMargin: '150px 0px' })
    : null;
  function onVisibility(el, cb) {
    if (!el || !viewport) return;
    watchers.set(el, (watchers.get(el) || []).concat(cb));
    viewport.observe(el);
  }

  // Looping CSS animations (orbits, marquee, service scenes, contact glow) pause while off-screen
  function setupIdleSections() {
    $$('main > section, .marquee').forEach((el) => onVisibility(el, (v) => el.classList.toggle('is-idle', !v)));
  }

  /* ---------- Interactions ---------- */
  function setupTheme() {
    $('#theme-toggle').addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  function setupMenu() {
    const btn = $('#menu-toggle');
    const links = $('#nav-links');
    const close = () => { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  function setupScroll() {
    const nav = $('.nav');
    const bar = $('#progress');
    const rail = $('#rail-fill');
    const timeline = $('#timeline');

    let max = 0, scrolled = null;
    const measure = () => { max = document.documentElement.scrollHeight - innerHeight; };
    const onScroll = perFrame(() => {
      const y = window.scrollY;
      if ((y > 8) !== scrolled) { scrolled = y > 8; nav.classList.toggle('scrolled', scrolled); }
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      // Fill the experience rail as the timeline scrolls past the middle of the screen
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / r.height));
      rail.style.transform = `scaleY(${p})`;
    });
    // Page height only changes on resize or when content (fonts, images) settles
    if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); onScroll(); }).observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });
    measure();
    onScroll();

    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }

    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => revealer.observe(el));

    // Highlight the nav link of the section in view
    const navLinks = $$('.nav__links a');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => spy.observe(s));
  }

  // Cursor-following spotlight on cards
  function setupSpotlight() {
    if (!finePointer) return;
    document.addEventListener('pointermove', perFrame((e) => {
      const card = e.target.closest && e.target.closest('.glow-card, .contact');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }), { passive: true });
  }

  // 3D tilt on the hero profile card
  function setupTilt() {
    const card = $('#tilt');
    if (!card || !finePointer || reduceMotion) return;
    const area = $('.hero__visual');
    let left = false;
    area.addEventListener('pointermove', perFrame((e) => {
      if (left) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
      card.style.setProperty('--sx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--sy', `${(y + 0.5) * 100}%`);
    }), { passive: true });
    area.addEventListener('pointerenter', () => { left = false; });
    area.addEventListener('pointerleave', () => { left = true; card.style.transform = ''; });
  }

  // Buttons that lean towards the cursor
  function setupMagnetic() {
    if (!finePointer || reduceMotion) return;
    $$('.magnetic').forEach((btn) => {
      let r = null; // measured once per hover, before the button starts moving
      btn.addEventListener('pointerenter', () => { r = btn.getBoundingClientRect(); });
      btn.addEventListener('pointermove', perFrame((e) => {
        if (!r) return;
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      }), { passive: true });
      btn.addEventListener('pointerleave', () => { r = null; btn.style.transform = ''; });
    });
  }

  // One clock drives both the footer time and the contact "My time" row
  function setupClock() {
    const hide = () => { $('.footer__time')?.remove(); $('#contact-time')?.remove(); };
    if (!P.timezone) { hide(); return; }
    let timeFmt, hourFmt;
    try {
      timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: P.timezone });
      hourFmt = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: P.timezone });
    } catch (e) { hide(); return; }

    const footer = $('#clock'), contact = $('#contact-clock'), mood = $('#contact-mood');
    const tick = () => {
      const now = new Date();
      const time = timeFmt.format(now);
      const hour = +hourFmt.format(now);
      footer.textContent = contact.textContent = time;
      mood.textContent =
        hour >= 9 && hour < 19 ? '· probably shipping code' :
        hour >= 19 && hour < 23 ? '· winding down, still checking mail' :
        '· asleep — I’ll reply first thing';
    };
    // Tick on the minute boundary instead of polling every 30s
    const schedule = () => setTimeout(() => { tick(); schedule(); }, 60000 - (Date.now() % 60000) + 50);
    tick();
    schedule();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  }

  /* ---------- Contact: message composer ---------- */
  function setupComposer() {
    const firstName = (P.name || '').split(' ')[0] || 'there';
    const starters = P.contactStarters || [];
    const form = $('#composer');
    const msg = $('#composer-msg');
    const send = $('#mail-btn');
    const box = $('#composer-starters');
    let subject = `Hello ${firstName} 👋`;

    box.innerHTML = starters.length
      ? `<span>Not sure what to write?</span>` + starters.map((s, i) => `<button type="button" class="starter" data-i="${i}">${esc(s.label)}</button>`).join('')
      : '';

    const isStarter = (t) => !t.trim() || starters.some((s) => s.text.trim() === t.trim());
    const update = () => {
      const text = msg.value.trim();
      // Starters only replace an empty box or another starter — never the visitor's own words
      box.classList.toggle('is-muted', !isStarter(msg.value));
      if (!text) { subject = `Hello ${firstName} 👋`; $$('.starter', box).forEach((x) => x.classList.remove('is-on')); }
      send.href = `mailto:${P.email}?subject=${encodeURIComponent(subject)}${text ? `&body=${encodeURIComponent(text)}` : ''}`;
      form.classList.toggle('is-ready', !!text);
    };

    box.addEventListener('click', (e) => {
      const b = e.target.closest('.starter');
      if (!b || !isStarter(msg.value)) return;
      const s = starters[+b.dataset.i];
      subject = s.subject || subject;
      $$('.starter', box).forEach((x) => x.classList.toggle('is-on', x === b));
      msg.value = s.text;
      msg.focus();
      msg.setSelectionRange(msg.value.length, msg.value.length);
      update();
    });
    msg.addEventListener('input', update);
    form.addEventListener('submit', (e) => e.preventDefault());
    update();

    send.addEventListener('click', (e) => {
      if (!msg.value.trim()) {
        e.preventDefault();
        msg.focus();
        toast('Write a quick note first ✍');
        return;
      }
      form.classList.remove('is-sent');
      void form.offsetWidth; // restart the paper-plane animation
      form.classList.add('is-sent');
      toast('Opening your email app ✈');
    });
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function setupCopy() {
    $('#copy-email').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(P.email);
        toast('Email copied ✓');
      } catch (e) {
        toast(P.email);
      }
    });
  }

  bindSimple();
  renderSocials();
  renderOrbit();
  renderCode();
  renderStats();
  renderMarquee();
  renderAbout();
  renderExperience();
  renderProjects();
  renderSkills();
  renderServices();
  renderFaq();
  numberSections();
  renderSchema();
  setupIdleSections();
  setupRotator();
  setupTheme();
  setupMenu();
  setupScroll();
  setupSpotlight();
  setupTilt();
  setupMagnetic();
  setupClock();
  setupCopy();
  setupComposer();
})();
