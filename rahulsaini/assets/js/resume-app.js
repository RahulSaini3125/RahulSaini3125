/*
 * Resume page (/resume/) runtime.
 *  - In production the page is prerendered at build time (tools/prerender), so this only wires
 *    up the "Download PDF" button.
 *  - Without a build (local dev, e.g. VS Code Live Server) resume/index.html is a small shell
 *    marked data-shell; this renders it from data.js with the same template the build uses.
 */
import { resumePage } from './resume-page.js?v=2';
import { downloadResume } from './resume-download.js?v=2';

const P = window.PROFILE;
const root = document.documentElement;

if (P && root.hasAttribute('data-shell')) {
  const doc = new DOMParser().parseFromString(resumePage(P, null), 'text/html');
  // Scripts in the template are already running (that's us) — don't copy them again
  doc.querySelectorAll('script[src]').forEach((s) => s.remove());
  document.head.replaceChildren(...[...doc.head.childNodes].map((n) => document.adoptNode(n)));
  document.body.replaceWith(document.adoptNode(doc.body));
  root.removeAttribute('data-shell');
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-resume="auto"]');
  if (!btn || !P) return;
  e.preventDefault();
  if (btn.getAttribute('aria-busy') === 'true') return;
  btn.setAttribute('aria-busy', 'true');
  try {
    await downloadResume(P, btn);
  } catch (err) {
    console.error(err);
    location.href = btn.href; // fall back to the prebuilt PDF
  } finally {
    btn.removeAttribute('aria-busy');
  }
});
