/**
 * First-party visitor tracking for quizpe.in.
 *
 * Fire-and-forget beacons to the back-end so the admin panel can show real
 * traffic and email on WhatsApp-button clicks. Uses the same POST-JSON path
 * as the enquiry form (CORS already allows it), with `keepalive` so a click
 * that navigates away still completes. Never throws, never blocks the UI.
 */

const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

/** A stable per-browser id so repeat views can be de-duplicated into uniques. */
function sid() {
  try {
    let s = localStorage.getItem('qp_sid');
    if (!s) {
      s = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem('qp_sid', s);
    }
    return s;
  } catch { return null; }
}

function post(path, body) {
  try {
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch { /* never let tracking break the page */ }
}

// Include the query string so ?utm_source=instagram / ?utm_source=youtube tags
// on the links we post are captured — the server classifies traffic sources
// from these (in-app browsers often strip document.referrer, so the UTM tag is
// the reliable signal for Instagram/YouTube).
export function trackView() {
  post('/public/track/view', { path: location.pathname + location.search, ref: document.referrer || '', sid: sid() });
}

export function trackWA(label = '') {
  post('/public/track/wa', { path: location.pathname + location.search, ref: document.referrer || '', sid: sid(), label });
  // also hand it to GTM so GA4 / Google Ads can count it as a conversion
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'wa_click', wa_label: label });
  } catch { /* GTM optional */ }
}
