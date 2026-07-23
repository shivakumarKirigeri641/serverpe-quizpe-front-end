/**
 * Plans.
 *
 * Every plan carries exactly the same features — the ONLY difference is how
 * many children it covers. So the benefits are stated once, in full, and the
 * plans below are reduced to the one thing that actually varies: price and
 * number of children. Repeating a near-identical list in each card invites a
 * parent to hunt for a difference that does not exist.
 *
 * Prices, durations and seats come from the API, so a price change never needs
 * a rebuild.
 */
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { api, safe } from '../lib/api';
import { WA_LINK, SUPPORT_EMAIL } from '../content';

/** What every plan includes — the trial too. Stated once, deliberately. */
const INCLUDED = [
  ['🎯', 'A fresh quiz every evening', 'Ten questions matched to your child’s board, grade and month.'],
  ['📄', 'A full report, immediately', 'Score, chapter breakdown and every question explained — as a PDF in your chat.'],
  ['🧠', 'It adapts to your child', 'Master a chapter and it moves on; struggle and it comes back until it sticks.'],
  ['🔁', 'Never the same question twice', 'Tens of thousands per grade, so that holds for years.'],
  ['📚', 'Spiral revision built in', 'June’s chapters return in July, July’s in August — nothing quietly fades.'],
  ['📖', 'Exam-time revision mode', 'Before school exams it shifts to recall across everything covered.'],
  ['⏱️', 'Speed, streaks and progress', 'Personal bests and a daily streak — what turns practice into a habit.'],
  ['🧾', 'A proper GST invoice', 'Sent to your WhatsApp after every payment.'],
];

export default function Pricing() {
  const [data, setData] = useState(null);
  useEffect(() => { safe(api.plans()).then(setData); }, []);
  const plans = data?.plans || [];
  const offer = data?.offer;
  const trial = plans.find((p) => p.is_trial);
  const paid = plans.filter((p) => !p.is_trial).sort((a, b) => a.price - b.price);

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

        {/* the trial first — trying costs nothing and converts better than copy */}
        {trial && (
          <Reveal delay={0.05}>
            <div className="mt-10 card p-6 sm:p-7 border-2 border-brand-accent shadow-lift
                            flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <span className="inline-block bg-brand-accent text-white text-[10px] font-extrabold
                                 uppercase tracking-wider px-3 py-1 rounded-full">Start here</span>
                <h3 className="font-extrabold text-brand text-xl mt-3">
                  {trial.duration} days free — everything below included
                </h3>
                <p className="text-sm text-muted mt-1">
                  No payment details. It ends by itself, so there is nothing to cancel and nothing is charged.
                </p>
              </div>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                 className="btn-wa !py-3 sm:w-auto w-full text-center">
                💬 Say “hi” to start free
              </a>
            </div>
          </Reveal>
        )}

        {/* ONE benefits list — because every plan really is the same */}
        <Reveal delay={0.1}>
          <div className="mt-8">
            <h3 className="text-center font-extrabold text-brand text-lg">
              Every plan includes all of this
            </h3>
            <p className="text-center text-sm text-muted mt-1">
              There is no “better” tier. The only thing that changes below is how many children are covered.
            </p>
            <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {INCLUDED.map(([icon, title, body]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-lg leading-none mt-0.5" aria-hidden>{icon}</span>
                  <div>
                    <p className="font-bold text-brand text-[15px]">{title}</p>
                    <p className="text-sm text-muted leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* plans: price x children only */}
        <Reveal delay={0.15}>
          <h3 className="text-center font-extrabold text-brand text-lg mt-14">
            Then just pick how many children
          </h3>
          <p className="text-center text-sm text-muted mt-1">
            Each child gets their own quiz, their own progress and their own report — whatever the plan.
          </p>

          {/* Seats remaining, with a bar. Shown only while the offer is really
              running — the API decides that, not this component. */}
          {offer?.active && (
            <div className="mt-6 max-w-md mx-auto rounded-2xl border-2 border-rose-200 bg-rose-50 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-extrabold text-rose-700">
                  {offer.label} — launch pricing
                </p>
                <p className="text-xs font-bold text-rose-700">
                  {offer.remaining} of {offer.cap} left
                </p>
              </div>
              <div className="h-2 rounded-full bg-rose-200/70 overflow-hidden mt-2">
                <div className="h-full bg-rose-500 rounded-full transition-all"
                     style={{ width: `${Math.max(3, offer.pct_taken)}%` }} />
              </div>
              <p className="text-xs text-rose-700/90 mt-2">
                {offer.taken === 0
                  ? 'Be among the first families — these prices go up once the seats are taken.'
                  : `${offer.taken} student${offer.taken === 1 ? ' has' : 's have'} joined at this price. Prices rise once all ${offer.cap} are taken.`}
              </p>
            </div>
          )}
        </Reveal>

        {!plans.length ? (
          <p className="text-center text-muted mt-8">Loading plans…</p>
        ) : (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {paid.map((p, i) => {
              const saving = p.comparable_price && p.comparable_price > p.price
                ? Math.round((1 - p.price / p.comparable_price) * 100) : 0;
              const best = i === paid.length - 1;   // most children = best value per child
              return (
                <Reveal key={p.plan_code} delay={0.2 + i * 0.06}>
                  <div className="card h-full p-6 flex flex-col text-center relative">
                    {best && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white
                                       text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                        Best per child
                      </span>
                    )}
                    <p className="text-5xl font-black text-brand-accent leading-none">{p.student_count}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted mt-1">
                      {p.student_count > 1 ? 'children' : 'child'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-line">
                      {/* the launch price is the one being charged, so it is
                          the big number; the regular price is struck through
                          beside it rather than replacing it */}
                      {p.is_launch_price && (
                        <s className="text-lg text-muted mr-1.5">₹{p.regular_price}</s>
                      )}
                      <span className="text-3xl font-black text-brand">₹{p.price}</span>
                      <span className="text-sm text-muted"> / {p.duration} days</span>
                    </div>
                    {p.per_day > 0 && (
                      <p className="text-xs text-muted mt-1">about ₹{p.per_day} a day</p>
                    )}
                    {p.is_launch_price ? (
                      <p className="text-xs mt-1.5 font-bold text-rose-600">
                        Launch price — save ₹{p.saving}
                      </p>
                    ) : saving > 0 && (
                      <p className="text-xs mt-1">
                        <s className="text-muted">₹{p.comparable_price}</s>{' '}
                        <span className="font-bold text-brand-accent">save {saving}%</span>
                      </p>
                    )}

                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                       className="btn-ghost w-full !py-2.5 !text-sm mt-5">
                      Choose this
                    </a>
                  </div>
                </Reveal>
              );
            })}

            <Reveal delay={0.2 + paid.length * 0.06}>
              <div className="card h-full p-6 flex flex-col text-center border-dashed border-2">
                <p className="text-5xl font-black text-brand leading-none">4+</p>
                <p className="text-xs font-bold uppercase tracking-wide text-muted mt-1">children</p>
                <div className="mt-4 pt-4 border-t border-line">
                  <span className="text-2xl font-black text-brand">Let’s talk</span>
                </div>
                <p className="text-xs text-muted mt-1">Families, tuition centres, schools</p>
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('QuizPe for 4+ children')}`}
                   className="btn-ghost w-full !py-2.5 !text-sm mt-5">
                  ✉️ Contact me
                </a>
                <p className="text-[11px] text-muted mt-2">{SUPPORT_EMAIL}</p>
              </div>
            </Reveal>
          </div>
        )}

        {/* The renewal promise. Worth its own panel rather than a footnote:
            "will I lose my remaining days?" is the exact worry that makes a
            parent wait until the last day, and answering it plainly is what
            gets renewals in early. */}
        <Reveal delay={0.28}>
          <div className="mt-10 max-w-2xl mx-auto rounded-2xl bg-cream p-6 text-center">
            <p className="text-2xl" aria-hidden>🎁</p>
            <h3 className="font-extrabold text-brand mt-2">Renew early. Lose nothing.</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Renewing before your plan ends does <b className="text-brand">not</b> wipe the days you
              have left — we add the new days on top of them. Renew on the 15th with 13 days still to
              run and you get all 13, plus the full new plan.
            </p>
            <p className="text-xs text-muted mt-2">
              Your quizzes never pause, and you are never charged for a day twice.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="text-center text-sm text-muted mt-8 max-w-2xl mx-auto">
            All prices include GST at {data?.gst_pct ?? 18}%. Paid periods are not refundable, which is
            precisely why the free trial is there: try it fully first, then decide.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
