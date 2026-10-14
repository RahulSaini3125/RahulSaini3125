/*
 * "Thanks for your interest" moment after someone downloads the resume:
 * a confetti burst from the download button + a small card with ways to get in touch.
 * Self-contained (injects its own styles), so it works on the homepage and on /resume/.
 * Colours come from the page's theme variables, with fallbacks for the resume page.
 */
const CSS = `
.rt-card {
  --rt-bg: var(--surface-solid, var(--paper, #fff));
  --rt-text: var(--text, var(--ink, #111827));
  --rt-muted: var(--text-muted, var(--body, #4b5563));
  --rt-border: var(--border, var(--rule, rgba(0,0,0,.08)));
  --rt-grad: var(--grad, linear-gradient(110deg, #14b8a6, #8b5cf6 55%, #ec4899));
  --rt-on-grad: var(--on-grad, #fff);
  position: fixed; z-index: 200; right: 24px; bottom: 24px; width: min(380px, calc(100vw - 32px));
  padding: 22px 22px 18px; border-radius: 22px; overflow: hidden;
  background: var(--rt-bg); color: var(--rt-text); border: 1px solid var(--rt-border);
  box-shadow: 0 30px 70px -28px rgba(20, 20, 50, .45);
  font: 14.5px/1.55 Inter, system-ui, -apple-system, 'Segoe UI', sans-serif;
  opacity: 0; transform: translateY(24px) scale(.96);
  transition: opacity .35s, transform .5s cubic-bezier(.2, .9, .3, 1.2);
}
.rt-card.rt-in { opacity: 1; transform: none; }
.rt-card::before { content: ''; position: absolute; inset: 0 0 auto; height: 4px; background: var(--rt-grad); }
.rt-head { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.rt-badge {
  flex: none; width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center;
  background: var(--rt-grad); color: var(--rt-on-grad); font-size: 21px;
  animation: rt-wave 1.4s ease-in-out .35s 2;
}
.rt-title { margin: 0; font: 700 17px/1.25 'Space Grotesk', Inter, sans-serif; letter-spacing: -.01em; }
.rt-text { margin: 0 0 14px; color: var(--rt-muted); }
.rt-sign { font-style: italic; }
.rt-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.rt-btn {
  display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 15px; border-radius: 999px;
  font-weight: 600; font-size: 13.5px; text-decoration: none; color: var(--rt-text);
  border: 1px solid var(--rt-border); transition: transform .2s, border-color .2s;
}
.rt-btn:hover { transform: translateY(-1px); border-color: currentColor; }
.rt-btn--main { background: var(--rt-grad); color: var(--rt-on-grad); border-color: transparent; }
.rt-close {
  position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%;
  display: grid; place-items: center; border: 0; background: transparent; color: var(--rt-muted);
  font-size: 18px; line-height: 1; cursor: pointer;
}
.rt-close:hover { background: var(--rt-border); color: var(--rt-text); }
.rt-bar { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--rt-grad); opacity: .5; transform-origin: left; }
.rt-card.rt-in .rt-bar { animation: rt-timer var(--rt-life, 12s) linear forwards; }
.rt-card:hover .rt-bar, .rt-card:focus-within .rt-bar { animation-play-state: paused; }

.rt-confetti { position: fixed; z-index: 201; width: 8px; height: 12px; border-radius: 2px; pointer-events: none;
  animation: rt-burst 1.1s cubic-bezier(.15, .7, .3, 1) forwards; }

@keyframes rt-burst {
  0% { transform: translate(-50%, -50%) rotate(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)); opacity: 0; }
}
@keyframes rt-wave { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(14deg); } 75% { transform: rotate(-10deg); } }
@keyframes rt-timer { to { transform: scaleX(0); } }

@media (max-width: 520px) { .rt-card { right: 16px; left: 16px; bottom: 16px; width: auto; } }
@media (prefers-reduced-motion: reduce) {
  .rt-card { transition: opacity .2s; transform: none; }
  .rt-badge { animation: none; }
}
`;

const COLORS = ['#14b8a6', '#5eead4', '#8b5cf6', '#a78bfa', '#ec4899', '#f9a8d4', '#fbbf24'];
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function ensureStyles() {
  if (document.getElementById('rt-styles')) return;
  const style = document.createElement('style');
  style.id = 'rt-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

function confetti(from) {
  if (reduced()) return;
  const r = from?.getBoundingClientRect?.();
  const x = r ? r.left + r.width / 2 : innerWidth / 2;
  const y = r ? r.top + r.height / 2 : innerHeight / 2;
  for (let i = 0; i < 34; i++) {
    const p = document.createElement('i');
    p.className = 'rt-confetti';
    const angle = (Math.PI * 2 * i) / 34 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 110;
    p.style.cssText =
      `left:${x}px;top:${y}px;background:${COLORS[i % COLORS.length]};` +
      `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist - 40}px;--rot:${Math.random() * 720 - 360}deg;` +
      `animation-delay:${Math.random() * 80}ms;` +
      (i % 3 === 0 ? 'width:7px;height:7px;border-radius:50%;' : '');
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

let current;
export function showThanks(P, from) {
  ensureStyles();
  confetti(from);
  current?.close();

  const first = String(P.name || '').split(' ')[0];
  const copy = {
    title: 'Thank you for considering me!',
    text: "My resume is on its way to your downloads. Hiring for a role or planning a project? I'd love to hear what you have in mind.",
    button: "Let's talk",
    ...(P.resumeThanks || {}),
  };
  const linkedin = (P.socials || []).find((s) => s.icon === 'linkedin');
  const onHome = !!document.getElementById('contact');
  const hello = onHome
    ? '#contact'
    : `mailto:${P.email}?subject=${encodeURIComponent(`About your resume, ${first}`)}`;

  const card = document.createElement('aside');
  card.className = 'rt-card';
  card.setAttribute('role', 'status');
  card.setAttribute('aria-live', 'polite');
  card.style.setProperty('--rt-life', '12s');
  card.innerHTML = `
    <button class="rt-close" type="button" aria-label="Close">&times;</button>
    <div class="rt-head">
      <span class="rt-badge" aria-hidden="true">🙌</span>
      <p class="rt-title">${esc(copy.title)}</p>
    </div>
    <p class="rt-text">${esc(copy.text)} <span class="rt-sign">— ${esc(first)}</span></p>
    <div class="rt-actions">
      ${P.email ? `<a class="rt-btn rt-btn--main" href="${esc(hello)}">${esc(copy.button)} 👋</a>` : ''}
      ${linkedin ? `<a class="rt-btn" href="${esc(linkedin.url)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
    </div>
    <span class="rt-bar" aria-hidden="true"></span>`;
  document.body.appendChild(card);
  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('rt-in')));

  const close = () => {
    document.removeEventListener('keydown', onKey);
    card.classList.remove('rt-in');
    setTimeout(() => card.remove(), 400);
    if (current === handle) current = null;
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  // Auto-close when the timer bar runs out (it pauses while hovered / focused)
  card.querySelector('.rt-bar').addEventListener('animationend', close);
  card.querySelector('.rt-close').addEventListener('click', close);
  card.querySelectorAll('.rt-btn').forEach((a) => a.addEventListener('click', () => setTimeout(close, 150)));
  document.addEventListener('keydown', onKey);

  const handle = { close };
  current = handle;
}
