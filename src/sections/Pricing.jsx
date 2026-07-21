/** Plans. Prices are stated plainly with what each includes — and the trial is
 *  presented first, because trying costs nothing and converts better than copy. */
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { api, safe } from '../lib/api';
import { WA_LINK } from '../content';

/** Copy per plan code. Prices, durations and seats come from the API — only
 *  the selling points live here, so a price change never needs a rebuild. */
const COPY = {
  TRY0: { cta: 'Start free', highlight: false,
    points: ['Daily quiz for the full trial', 'Full explanation report each day',
             'No payment details needed', 'Ends by itself — nothing is charged'] },
  PREMIUM99: { cta: 'Choose Solo', highlight: true,
    points: ['Everything in the trial', 'Adaptive difficulty per chapter',
             'Weekly progress report', 'Exam-time revision mode'] },
  PREMIUM169: { cta: 'Choose Premium +', highlight: false,
    points: ['Everything in Solo', 'Two children, separate progress',
             'A separate report for each child', 'Different boards and grades allowed'] },
  PREMIUM249: { cta: 'Choose Ultra', highlight: false,
    points: ['Everything in Premium +', 'Three children', 'Best value per child',
             'Ideal for siblings in different grades'] },
};

export default function Pricing() {
  const [data, setData] = useState(null);
  useEffect(() => { safe(api.plans()).then(setData); }, []);
  const plans = data?.plans || [];

  return (
    <section id="pricing" className="py-20">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Pricing</span>
          <h2 className="h2 mt-4">Less than a coffee. Every single day.</h2>
          <p className="lede mt-3">
            Start with the free trial — no card, nothing to cancel. Move to a paid plan only if your child
            is actually doing it.
          </p>
        </Reveal>

        {!plans.length ? (
          <p className="text-center text-muted mt-12">Loading plans…</p>
        ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {plans.map((p, i) => {
            const c = COPY[p.plan_code] || { cta: 'Choose plan', highlight: false, points: [] };
            const saving = p.comparable_price && p.comparable_price > p.price
              ? Math.round((1 - p.price / p.comparable_price) * 100) : 0;
            return (
              <Reveal key={p.plan_code} delay={i * 0.07}>
                <div className={`card h-full p-6 flex flex-col relative ${c.highlight ? 'border-brand-accent border-2 shadow-lift' : ''}`}>
                  {c.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-white
                                     text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-extrabold text-brand">{p.plan_name}</h3>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-brand">
                      {p.is_trial ? 'Free' : `₹${p.price}`}
                    </span>
                    <span className="text-sm text-muted">/ {p.duration} days</span>
                  </div>
                  {saving > 0 && !p.is_trial && (
                    <p className="text-xs text-muted mt-1">
                      <s>₹{p.comparable_price}</s>{' '}
                      <span className="font-bold text-brand-accent">save {saving}%</span>
                    </p>
                  )}
                  <p className="text-xs font-bold text-brand-accent mt-1">
                    {p.student_count} child{p.student_count > 1 ? 'ren' : ''}
                    {!p.is_trial && p.per_day > 0 && ` · about ₹${p.per_day}/day`}
                  </p>

                  <ul className="mt-5 space-y-2 flex-1">
                    {c.points.map((pt) => (
                      <li key={pt} className="flex gap-2 text-sm text-muted">
                        <span className="text-brand-accent font-bold" aria-hidden>✓</span>{pt}
                      </li>
                    ))}
                  </ul>

                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                     className={`mt-6 ${c.highlight ? 'btn-wa' : 'btn-ghost'} w-full !py-3 !text-sm`}>
                    {c.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
        )}

        <Reveal delay={0.25}>
          <p className="text-center text-sm text-muted mt-8 max-w-2xl mx-auto">
            All prices include GST at {data?.gst_pct ?? 18}%. A proper tax invoice reaches you on WhatsApp after every payment.
            Cancel any time; full refund within 7 days if it is not right for your child.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
