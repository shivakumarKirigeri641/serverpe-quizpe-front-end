/**
 * Everything the marketing site reads comes from the QuizPe back-end, so the
 * numbers on the page are always the real ones and never drift from the
 * product. Failures are swallowed into a null result: a landing page must
 * still render if the API is briefly unreachable.
 */

const call = async (path, opts) => {
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  stats: () => call('/public/stats'),
  coverage: () => call('/public/coverage'),
  plans: () => call('/public/plans'),
  testimonials: () => call('/public/testimonials'),
  queryTypes: () => call('/public/query-types'),
  legal: () => call('/legal'),
  sendEnquiry: (body) => call('/public/enquiry', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }),
  sendFeedback: (body) => call('/public/feedback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }),
};

/** Never let a failed fetch blank the page. */
export const safe = (p, fallback = null) => p.then((d) => d).catch(() => fallback);
