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

/* ---- the parent's account, quizpe.in/app (2026-10-08, WhatsApp retired) ----
   Signed in by an SMS code; the session is a bearer token kept on this device. */
const TOKEN_KEY = 'quizpe_app_token';
export const appToken = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } },
  set: (t) => { try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } },
};
const appCall = async (path, body) => {
  const t = appToken.get();
  const res = await fetch(`${BASE}/app/api${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) { appToken.set(''); const e = new Error(data.error || 'Please sign in again.'); e.signIn = true; throw e; }
  if (!res.ok || data.success === false) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
};
export const app = {
  sendCode: (mobile) => appCall('/code', { mobile }),
  verify: (mobile, code, termsAccepted) => appCall('/verify', { mobile, code, terms_accepted: termsAccepted === true }),
  signOut: () => appCall('/signout', {}).catch(() => null),
  me: () => appCall('/me'),
  profile: (body) => appCall('/profile', body),
  startQuiz: (studentId, level) => appCall('/quiz/start', { student_id: studentId, ...(level ? { level } : {}) }),
  reports: () => appCall('/reports'),
  trial: (parentName, email) => appCall('/trial', { parent_name: parentName, email }),
  checkout: (planCode, someoneElse = false) => appCall('/checkout', { plan_code: planCode, someone_else: someoneElse === true }),
  // The WhatsApp menu on the web (2026-10-10): the bot's own subscription / schedule texts, and the support form.
  info: (what) => appCall(`/info/${what}`),
  supportLink: () => appCall('/support', {}),
  pushKey: () => appCall('/push-key'),
  pushOn: (subscription) => appCall('/push', { subscription }),
  pushOff: (endpoint) => appCall('/push/off', { endpoint }),
};

/** Never let a failed fetch blank the page. */
export const safe = (p, fallback = null) => p.then((d) => d).catch(() => fallback);
