/**
 * Streaks, badges, the class leaderboard and the April–May certificate.
 *
 * The point of this section is not "we gamified it". It is that the hardest
 * part of daily practice is turning up on day nine, and every reward here is
 * built around returning rather than around being clever. That is also why the
 * leaderboard is ranked on days attended, not on marks — a child who is not
 * top of the class can still be top of the board, and a child who is already
 * top of the class cannot coast.
 *
 * Badges are read from the API so the list here can never drift from the ones
 * actually being awarded.
 */

import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { api, safe } from '../lib/api';
import { WA_LINK } from '../content';

const TIER = {
  gold:   'bg-amber-50 border-amber-300',
  silver: 'bg-slate-50 border-slate-300',
  bronze: 'bg-orange-50 border-orange-200',
};

/** Shown while the API is loading, and if it is unreachable. */
const FALLBACK = [
  { badge_code: 'streak_3',  icon: '🔥', badge_name: 'On a Roll',      description: 'Three days in a row', tier: 'bronze' },
  { badge_code: 'streak_7',  icon: '⚡', badge_name: 'Week Warrior',   description: 'Seven days without missing one', tier: 'silver' },
  { badge_code: 'streak_28', icon: '💎', badge_name: 'Unbroken',       description: 'A full month, every single day', tier: 'gold' },
  { badge_code: 'perfect',   icon: '💯', badge_name: 'Full Marks',     description: 'Scored 10 out of 10', tier: 'silver' },
];

export default function Rewards() {
  const [badges, setBadges] = useState(null);
  useEffect(() => { safe(api.badges()).then((r) => setBadges(r?.badges || null)); }, []);
  const list = badges?.length ? badges : FALLBACK;

  return (
    <section id="rewards" className="py-20 bg-cream">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Keeping it going</span>
          <h2 className="h2 mt-4">The hard part isn’t day one. It’s day nine.</h2>
          <p className="lede mt-3">
            Any child will do a quiz once. QuizPe is built around the thing that actually
            matters — coming back tomorrow, and the day after.
          </p>
        </Reveal>

        {/* streak */}
        <Reveal delay={0.05}>
          <div className="mt-10 card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center shrink-0">
              <p className="text-6xl" aria-hidden>🔥</p>
              <p className="text-3xl font-black text-brand mt-1">12</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">day streak</p>
            </div>
            <div>
              <h3 className="font-extrabold text-brand text-lg">A streak your child protects</h3>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                Every finished quiz adds a day. Miss one and it resets — which is exactly why
                children come back. We tell them their streak the moment they finish, along with
                their own best, so the thing they are competing against is themselves.
              </p>
              <p className="text-xs text-muted mt-2">
                Miss a day and nothing else is lost: no penalty, no backlog, and the chapter simply
                returns in the revision cycle.
              </p>
            </div>
          </div>
        </Reveal>

        {/* badges */}
        <Reveal delay={0.1}>
          <h3 className="text-center font-extrabold text-brand text-lg mt-14">Badges worth earning</h3>
          <p className="text-center text-sm text-muted mt-1">
            Awarded automatically, announced on WhatsApp, and never taken away.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <div key={b.badge_code}
                   className={`rounded-2xl border-2 p-4 flex items-start gap-3 ${TIER[b.tier] || TIER.bronze}`}>
                <span className="text-2xl leading-none" aria-hidden>{b.icon}</span>
                <div>
                  <p className="font-extrabold text-brand text-[15px]">{b.badge_name}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* leaderboard */}
        <Reveal delay={0.15}>
          <div className="mt-14 grid gap-6 lg:grid-cols-2 items-start">
            <div className="card p-6">
              <h3 className="font-extrabold text-brand text-lg">🏆 Your child’s own leaderboard</h3>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                Ranked against children in the <b className="text-brand">same board and the same grade</b> —
                never one giant list. And ranked on <b className="text-brand">days attended first</b>,
                marks only as a tiebreak, so it is won by turning up rather than by being the
                cleverest in the room.
              </p>
              <div className="mt-4 rounded-xl bg-cream p-3 space-y-1.5">
                {[['🥇', 'Meera N.', '28 days', '92%'],
                  ['🥈', 'Aarav K.', '27 days', '88%'],
                  ['🥉', 'Your child', '26 days', '85%']].map(([m, n, d, a], i) => (
                  <div key={n} className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 ${
                    i === 2 ? 'bg-brand-accent/15 font-bold' : ''}`}>
                    <span aria-hidden>{m}</span>
                    <span className="flex-1">{n}</span>
                    <span className="text-xs text-muted">{d}</span>
                    <span className="text-xs font-bold text-brand w-10 text-right">{a}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted mt-2">
                Only a first name and an initial is ever shown — never a full name, school or number.
              </p>
            </div>

            {/* certificate */}
            <div className="card p-6 border-2 border-brand-accent">
              <span className="inline-block bg-brand-accent text-white text-[10px] font-extrabold
                               uppercase tracking-wider px-3 py-1 rounded-full">April & May</span>
              <h3 className="font-extrabold text-brand text-lg mt-3">🎓 The consistency certificate</h3>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                Complete <b className="text-brand">every</b> quiz through April and May, with no gap
                between renewals, and your child gets a signed certificate — free — naming their
                streak, their accuracy and the number of quizzes they finished.
              </p>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                It is deliberately hard. A certificate every child receives is worth nothing on a
                wall, so this one means what it says.
              </p>
              <div className="mt-4 pt-4 border-t border-line">
                <p className="font-bold text-brand text-sm">☀️ Summer Quiz Challenge</p>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  A timed competition across the April–May holidays.
                  <b className="text-brand"> Free</b> if your child earned the consistency certificate.
                  Everyone else is welcome at <b className="text-brand">₹49 + GST</b>.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Referral. Placed after the rewards rather than before: a parent has
            to want the thing before being asked to recommend it. */}
        <Reveal delay={0.18}>
          <div className="mt-6 card p-6 sm:p-8 border-2 border-brand text-center">
            <p className="text-2xl" aria-hidden>🎁</p>
            <h3 className="font-extrabold text-brand text-lg mt-2">
              Give 7 days. Get 7 days.
            </h3>
            <p className="text-sm text-muted mt-2 max-w-xl mx-auto leading-relaxed">
              Every parent gets their own invite link. Share it with another parent — when they
              subscribe, <b className="text-brand">you both</b> get 7 free days added to your plans.
              No cash, no coupons, no catch.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 text-left max-w-2xl mx-auto">
              {[['1', 'Find your link', 'Type “menu” on WhatsApp and tap Refer a friend.'],
                ['2', 'Share it', 'Forward the ready-made message to a parent or a class group.'],
                ['3', 'Both get days', 'Added automatically the moment they subscribe.']].map(([n, t, b]) => (
                <div key={n} className="rounded-xl bg-cream p-4">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-extrabold
                                   grid place-items-center">{n}</span>
                  <p className="font-bold text-brand text-sm mt-2">{t}</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-4">
              Days are added to your existing plan — they never replace the days you already have.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="text-center mt-10">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <span aria-hidden>💬</span> Start my child’s streak
          </a>
          <p className="text-xs text-muted mt-3">Free trial · no card · one message to start</p>
        </Reveal>
      </div>
    </section>
  );
}
