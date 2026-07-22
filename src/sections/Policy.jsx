/**
 * A single policy, rendered at its own clean URL — /privacy, /terms,
 * /data-deletion and the rest.
 *
 * The site is one page with no router, but nginx's SPA fallback already serves
 * index.html for any unknown path, so the app can simply read the pathname and
 * render the matching policy. That means these URLs work with no server config
 * beyond what is already there — which is what WhatsApp/Meta ask for during
 * business verification.
 *
 * Content comes from the back-end, so a policy edited in the database is live
 * here immediately and can never drift from the copy the product actually uses.
 */

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api, safe } from '../lib/api';

// Clean URL -> doc_code. Meta asks for a "data deletion" URL specifically, so
// the Data Retention and Deletion policy is published as /data-deletion.
const SLUG_TO_CODE = {
  privacy: 'privacy',
  terms: 'terms',
  'data-deletion': 'data_retention',
  'children-data': 'children_data',
  communications: 'communications',
  refund: 'refund',
  'pricing-gst': 'pricing_gst',
  'content-ip': 'content_ip',
  'acceptable-use': 'acceptable_use',
  liability: 'liability',
  grievance: 'grievance',
  security: 'security',
};

/** The policy slug for the current URL, or null if this is not a policy page. */
export function policySlug(pathname = window.location.pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return SLUG_TO_CODE[slug] ? slug : null;
}

/**
 * doc_code -> clean URL, e.g. 'data_retention' -> '/data-deletion'.
 * Used by the footer so policy links stay on this site instead of bouncing to
 * the API host. Falls back to the API's readable page if a document ever
 * appears that has no page here, so a link is never dead.
 */
export function policyHref(code, apiOrigin = '') {
  const slug = Object.keys(SLUG_TO_CODE).find((k) => SLUG_TO_CODE[k] === code);
  return slug ? `/${slug}` : `${apiOrigin}/legal.html?doc=${encodeURIComponent(code)}`;
}

export default function Policy({ slug }) {
  const code = SLUG_TO_CODE[slug];
  const [doc, setDoc] = useState(null);
  const [index, setIndex] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    safe(api.legalDoc(code)).then((d) => (d?.document ? setDoc(d.document) : setFailed(true)));
    safe(api.legal()).then(setIndex);
  }, [code]);

  const biz = index?.business || {};
  const g = index?.grievance_officer || {};

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{doc ? `${doc.title} — QuizPe` : 'Policy — QuizPe'}</title>
        <meta name="description" content={doc?.summary || 'QuizPe policies'} />
        <link rel="canonical" href={`https://quizpe.in/${slug}`} />
      </Helmet>

      <header className="bg-brand text-white py-8 px-5">
        <div className="max-w-3xl mx-auto">
          <a href="/" className="text-[13px] text-white/70 hover:text-white">← quizpe.in</a>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">
            {doc?.title || 'Loading…'}
          </h1>
          <p className="text-[13px] text-white/70 mt-1.5">
            QuizPe — a service of {biz.company_name || 'ServerPe App Solutions'}
            {doc?.effective_from && ` · Effective ${new Date(doc.effective_from)
              .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8">
        {failed && (
          <p className="text-sm text-red-600">
            We could not load this policy right now. Please try again, or write to{' '}
            <a className="underline" href="mailto:support@quizpe.in">support@quizpe.in</a>.
          </p>
        )}

        {doc?.summary && (
          <p className="rounded-xl bg-slate-50 border border-line p-4 text-[15px] text-muted">
            {doc.summary}
          </p>
        )}

        {(doc?.sections || []).map((s) => (
          <section key={`${s.section_no}-${s.title}`} className="mt-7">
            <h2 className="text-lg font-bold text-brand">
              {s.section_no ? `${s.section_no}. ` : ''}{s.title}
            </h2>
            {String(s.description || '').split(/\n+/).map((para, i) => (
              <p key={i} className="mt-1.5 leading-relaxed">{para}</p>
            ))}
          </section>
        ))}

        <footer className="mt-12 pt-6 border-t border-line text-[13px] text-muted">
          <p className="font-bold text-brand">{biz.company_name || 'ServerPe App Solutions'}</p>
          {biz.address && <p>{biz.address}</p>}
          {biz.gstin && <p>GSTIN {biz.gstin}</p>}
          <p className="mt-2">
            Questions about this policy:{' '}
            <a className="underline" href={`mailto:${biz.support_email || 'support@quizpe.in'}`}>
              {biz.support_email || 'support@quizpe.in'}
            </a>
          </p>
          {g.name && (
            <p className="mt-1">
              Grievance Officer: {g.name}
              {g.email && <> · <a className="underline" href={`mailto:${g.email}`}>{g.email}</a></>}
            </p>
          )}

          <p className="mt-4 font-semibold text-brand">All policies</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {(index?.documents || []).map((d) => {
              const s = Object.keys(SLUG_TO_CODE).find((k) => SLUG_TO_CODE[k] === d.doc_code);
              return s ? <a key={d.doc_code} href={`/${s}`} className="hover:text-brand underline">{d.title}</a> : null;
            })}
          </div>
        </footer>
      </main>
    </div>
  );
}
