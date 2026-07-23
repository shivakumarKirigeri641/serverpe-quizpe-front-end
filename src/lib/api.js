/**
 * Everything the marketing site reads comes from the QuizPe back-end, so the
 * numbers on the page are always the real ones and never drift from the
 * product. Failures are swallowed into a null result: a landing page must
 * still render if the API is briefly unreachable.
 */

// Empty in development, where Vite proxies /public and /legal to port 5008.
// In production the site is quizpe.in and the API is api.quizpe.in, so this is
// set to that absolute origin at build time via VITE_API_BASE.
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
// The static legal/quiz/pay pages are served by the back-end, not the site's
// own host, so links to them must use the API origin (empty in dev = same host).
export const API_ORIGIN = BASE;

const call = async (path, opts) => {
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  stats: () => call('/public/stats'),
  coverage: () => call('/public/coverage'),
  plans: () => call('/public/plans'),
  launchOffer: () => call('/public/launch-offer'),
  badges: () => call('/public/badges'),
  testimonials: () => call('/public/testimonials'),
  queryTypes: () => call('/public/query-types'),
  legal: () => call('/legal'),
  // one policy with its sections, for the /privacy, /terms, /data-deletion pages
  legalDoc: (code) => call(`/legal/${encodeURIComponent(code)}`),
  sendEnquiry: (body) => call('/public/enquiry', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }),
  sendFeedback: (body) => call('/public/feedback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }),
};

/** Never let a failed fetch blank the page. */
export const safe = (p, fallback = null) => p.then((d) => d).catch(() => fallback);
