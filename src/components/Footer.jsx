/**
 * Footer with the legal links, business identity and Grievance Officer.
 *
 * Policy links open the back-end's own readable page in a new tab, so a parent
 * always sees the current version straight from the database rather than a
 * copy that could drift out of date.
 */

import { WA_LINK, WA_SUPPORT_LINK, WHATSAPP_DISPLAY, SUPPORT_EMAIL, COMPANY_EMAIL } from '../content';

const LEGAL_BASE = '/legal.html';

export default function Footer({ legal, business }) {
  const docs = legal?.documents || [];
  const g = legal?.grievance_officer || {};
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-white/80">
      <div className="container-x py-14 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src="/assets/logo-mark.png" alt="" className="w-10 h-10 rounded-xl bg-white p-1" />
            <div>
              <p className="font-extrabold text-white text-lg leading-tight">QuizPe</p>
              <p className="text-[11px] text-white/60">Small quiz, Big progress</p>
            </div>
          </div>
          <p className="text-sm mt-4 leading-relaxed">
            A daily quiz on WhatsApp for school children. No app, no login, no registration.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 mt-5 rounded-full bg-brand-accent text-white
                        px-5 py-2.5 text-sm font-bold hover:bg-brand-light transition">
            💬 Say “hi” to start
          </a>
        </div>

        <nav aria-label="Site">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[['How it works', '#how-it-works'], ['Why QuizPe', '#why'], ['Coverage', '#coverage'],
              ['Pricing', '#pricing'], ['About the founder', '#about'], ['Reviews', '#testimonials'],
              ['FAQ', '#faq'], ['Contact', '#contact']].map(([l, h]) => (
              <li key={h}><a href={h} className="hover:text-white transition">{l}</a></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {docs.length ? docs.map((d) => (
              <li key={d.doc_code}>
                {/* new tab: a parent reading a policy should not lose the page */}
                <a href={`${LEGAL_BASE}?doc=${encodeURIComponent(d.doc_code)}`}
                   target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition">{d.title}</a>
              </li>
            )) : (
              <>
                <li><a href={`${LEGAL_BASE}?doc=terms`} target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
                <li><a href={`${LEGAL_BASE}?doc=privacy`} target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                <li><a href={`${LEGAL_BASE}?doc=refund`} target="_blank" rel="noopener noreferrer">Refund Policy</a></li>
              </>
            )}
            <li>
              <a href={`${LEGAL_BASE}?consent=1`} target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition font-semibold">What you agree to</a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>💬 <a href={WA_SUPPORT_LINK} target="_blank" rel="noopener noreferrer"
                     className="hover:text-white">{WHATSAPP_DISPLAY}</a></li>
            <li>✉️ <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white">{SUPPORT_EMAIL}</a></li>
            <li className="text-white/50 text-[11px]">For anything about QuizPe, write to the address above.</li>
          </ul>

          {g.name && (
            <div className="mt-5 text-xs leading-relaxed">
              <p className="text-white font-bold">Grievance Officer</p>
              <p>{g.name}{g.designation ? `, ${g.designation}` : ''}</p>
              {g.email && <p><a href={`mailto:${g.email}`} className="hover:text-white">{g.email}</a></p>}
              {g.phone && <p>{g.phone}</p>}
              <p className="text-white/40 mt-1">
                This is the statutory contact for {business.company_name || 'ServerPe App Solutions'},
                the company that operates QuizPe. For help with the service itself, please use{' '}
                {SUPPORT_EMAIL}.
              </p>
              <p className="text-white/50 mt-1">
                Acknowledged within {g.acknowledge_hours}h · resolved within {g.resolve_days} days
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x py-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <p>
            QuizPe™ is a service of {business.company_name || 'ServerPe App Solutions'}™.
            {' '}All rights reserved, {year}.
          </p>
          {business.gstin && <p>GSTIN {business.gstin}</p>}
          {business.address && <p className="text-white/50">{business.address}</p>}
          <p className="lg:ml-auto font-semibold text-white/90">
            Powered by: {business.company_name || 'ServerPe App Solutions'}™
          </p>
        </div>
        <div className="container-x pb-6 text-[11px] text-white/45 leading-relaxed">
          <p>
            QuizPe™ and ServerPe App Solutions™ are unregistered trade marks; applications are pending.
            QuizPe provides supplementary practice questions composed in-house on syllabus topics — nothing
            is copied or reproduced from any textbook or publisher.
            We are not affiliated with, endorsed by or connected to CBSE, NCERT, ICSE, any state board,
            school or textbook publisher. All trademarks belong to their respective owners.
            No examination result or academic outcome is promised or guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
