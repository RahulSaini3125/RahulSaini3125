/*
 * Builds the resume PDF in the browser and saves it. Shared by the homepage (main.js, via
 * dynamic import) and the resume page (resume-app.js). jsPDF, the builder and its fonts are
 * fetched on first use, from this site only (the CSP allows 'self').
 * Paths are resolved from this file, so it works from / and /resume/ alike.
 */
import { showThanks } from './resume-thanks.js?v=1';

const at = (path) => new URL(path, import.meta.url).href;

const loadScript = (src) =>
  new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = ok;
    s.onerror = () => fail(new Error(`Could not load ${src}`));
    document.head.appendChild(s);
  });

let ready;
// `from` is the clicked button — the thank-you confetti bursts out of it.
export async function downloadResume(P, from) {
  ready ||= loadScript(at('./vendor/jspdf.umd.min.js?v=4.2.1'))
    .then(() => loadScript(at('./resume.js?v=4')))
    .then(() => window.ResumeBuilder.loadFonts(at('../fonts/')))
    .catch((err) => {
      ready = null; // allow a retry
      throw err;
    });
  const fonts = await ready;
  window.ResumeBuilder.build(P, fonts).save(window.ResumeBuilder.fileName(P));
  showThanks(P, from);
}
