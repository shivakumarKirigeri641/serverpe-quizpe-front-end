/**
 * quizpe.in/app — the parent's QuizPe now that WhatsApp is gone (2026-10-08).
 *
 * Sign in with the mobile number used for QuizPe (an SMS code; Terms and
 * Privacy ticked first). The same number finds the same family, so parents who
 * used QuizPe on WhatsApp see their children, plan and reports straight away.
 *
 * Everything the WhatsApp menu offered is here: start today's quiz (it opens
 * the same quiz page), the free trial, plans and renewal (the same checkout),
 * reports and invoices, and reminders — by phone push and email instead of
 * chat messages.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { app, appToken } from '../lib/api';
import { SUPPORT_EMAIL } from '../content';
import * as install from '../lib/install';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '');
const fmtTime = (hhmm) => {
  const [h, m] = String(hhmm || '').split(':').map(Number);
  if (Number.isNaN(h)) return '';
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
// The line in the welcome (user, 2026-10-10), the same news as the hanging notice.
const WEB_NOTE = 'QuizPe now serves you here on the web — our WhatsApp account was disabled. Quiz reminders and reports reach you by browser notifications, email and SMS.';

function Shell({ children, onSignOut, mobile, onInstall, onMenu, who }) {
  return (
    <div className="min-h-screen bg-cream">
      <Helmet><title>My QuizPe</title><meta name="robots" content="noindex" /></Helmet>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-2.5">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src="/assets/logo-mark.png" alt="QuizPe" className="w-8 h-8 rounded-lg" />
            {/* On a phone the student's name takes the word's place — the logo says QuizPe. */}
            <span className={`font-extrabold text-brand ${who ? 'hidden sm:inline' : ''}`}>QuizPe</span>
          </a>
          {mobile ? (
            <>
              {/* The student's name at the top (2026-10-10), set in My profile. */}
              {who ? <span className="text-sm font-bold text-ink truncate min-w-0" data-test="header-who"><span className="hidden sm:inline">· </span>{who}</span> : null}
              <span className="ml-auto text-xs text-muted tabular-nums hidden sm:inline">+91 {mobile.slice(0, 5)} {mobile.slice(5)}</span>
              {/* Install the app — not when it is opened as the installed app (2026-10-10). */}
              {onInstall && !install.standalone() ? (
                <button onClick={onInstall} data-test="install-link" className="ml-auto sm:ml-0 shrink-0 whitespace-nowrap text-xs font-bold text-white bg-brand rounded-full px-3 py-1.5">📲 Install</button>
              ) : <span className="ml-auto sm:hidden" />}
              {/* The main menu, from anywhere (2026-10-10) — sign out is inside it. */}
              {onMenu ? (
                <button onClick={onMenu} data-test="menu-open" className="shrink-0 whitespace-nowrap text-xs font-bold text-brand border border-line rounded-full px-3 py-1.5">☰ Menu</button>
              ) : <button onClick={onSignOut} className="text-xs font-bold text-brand border border-line rounded-full px-3 py-1.5">Sign out</button>}
            </>
          ) : null}
        </div>
      </header>
      <main className="max-w-xl mx-auto px-4 py-5 space-y-4">{children}</main>
      <footer className="max-w-xl mx-auto px-4 pb-10 pt-2 text-center text-xs text-muted">
        Help: <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> · <a className="underline" href="/terms">Terms</a> · <a className="underline" href="/privacy">Privacy</a> · <a className="underline" href="/refund">Refunds</a>
      </footer>
    </div>
  );
}

/*
 * "INSTALL THE APP" (user, 2026-10-10, like GaadiPe): the browser's own pop-up is rare —
 * never on iPhone — so the app offers it after sign-in, and from the header. Android /
 * Chrome: the button opens the real install dialog. iPhone: Share → Add to Home Screen
 * (which is also what lets an iPhone get QuizPe's reminder notifications). Never shown
 * once installed (lib/install.js); "Not now" hides it for 14 days.
 */
function InstallCard({ onClose }) {
  const [, tick] = useState(0);
  useEffect(() => install.onChange(() => tick((x) => x + 1)), []);
  const [note, setNote] = useState(null);
  const how = install.mode();
  if (!how && !note) {
    return (
      <div className="card p-4 text-sm" data-test="install-card">
        {install.standalone() ? '✅ QuizPe is already installed on this phone.'
          : 'Open your browser’s menu (⋮ or ⋯) and tap “Install app” or “Add to Home screen”. On a computer, there is also an install icon at the right of the address bar.'}
        <button className="ml-2 underline font-semibold" onClick={onClose}>Close</button>
      </div>
    );
  }
  if (note) return <Note tone="good">{note} <button className="underline font-semibold ml-1" onClick={onClose}>Close</button></Note>;
  return (
    <div className="card p-4" data-test="install-card">
      <div className="flex items-start gap-3">
        <img src="/icon-192.png" alt="" className="w-11 h-11 rounded-xl shadow-sm shrink-0" />
        <div className="text-sm">
          <div className="font-extrabold text-brand">📲 Get QuizPe on your home screen</div>
          <p className="text-muted mt-0.5">Opens in one tap like an app — today's quiz, reports and reminders. No Play Store, almost no space.</p>
          {how === 'ios' ? (
            <ol className="mt-2 space-y-1 text-ink">
              <li>1. Tap the <b>Share</b> button <span aria-hidden="true">⬆️</span> at the bottom of Safari</li>
              <li>2. Choose <b>Add to Home Screen</b></li>
              <li>3. Tap <b>Add</b> — and reminders can reach this iPhone too</li>
            </ol>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {how === 'prompt' ? (
          <button className="btn-wa !px-4 !py-2 !text-sm" data-test="install-go" onClick={async () => {
            const out = await install.promptInstall();
            if (out === 'accepted') setNote('🎉 QuizPe is on your home screen now — open it from there any time.');
            else onClose();
          }}>Install QuizPe</button>
        ) : (
          // "Got it" on iPhone: they have the steps — not offered again for a while.
          <button className="btn-wa !px-4 !py-2 !text-sm" data-test="install-ok" onClick={() => { install.later(); onClose(); }}>Got it</button>
        )}
        <button className="btn-ghost !px-4 !py-2 !text-sm" data-test="install-later" onClick={() => { install.later(); onClose(); }}>Not now</button>
      </div>
    </div>
  );
}

/* WhatsApp's *bold* and _italic_, as the bot wrote them. */
function BotText({ text }) {
  return String(text || '').split('\n').map((line, i) => (
    <span key={i} className="block min-h-[0.5em]">
      {line.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((p, j) => (/^\*[^*]+\*$/.test(p) ? <b key={j}>{p.slice(1, -1)}</b>
        : /^_[^_]+_$/.test(p) ? <i key={j}>{p.slice(1, -1)}</i> : <span key={j}>{p}</span>))}
    </span>
  ));
}

/*
 * THE MAIN MENU, AS ON WHATSAPP (user, 2026-10-10: "menu contains same like whatsapp
 * menu ... profile must be at the top"). The bot's list (whatsapp/userContext.js
 * buildMainMenu) — start quiz, schedule, subscription, reports, plans, support — with
 * the profile first, then what only an account on the web has: notifications, install,
 * sign out, sign out from all devices and deactivate. Refer-a-friend and the ₹9 Instant
 * Quiz stay off: both still finish on WhatsApp.
 *
 * Every answer ends with TAPPABLE REPLIES (<Replies>), like the bot's reply buttons, so
 * the parent always sees what to do next, with "☰ Menu" and "🏠 Home" one tap away.
 */
const plansLabel = (me) => (me.status === 'EXPIRED' ? ['🔄', 'Renew plan'] : !me.subscribed ? ['🚀', 'View plans'] : ['💎', 'View plans']);
const LABELS = {
  home: ['🏠', 'Home'],
  menu: ['☰', 'Menu'],
  profile: ['👤', 'My profile'],
  quiz: ['▶️', 'Start quiz now'],
  trial: ['🎁', 'Start free trial'],
  schedule: ['📅', 'Quiz schedule'],
  subscription: ['📄', 'My subscription'],
  reports: ['📊', 'My reports'],
  notifications: ['🔔', 'Notifications'],
  support: ['💬', 'Help & support'],
  install: ['📲', 'Install the app'],
  resume: ['▶️', 'Resume QuizPe'],
  comeback: ['🎁', 'Start my free days'],
  signout: ['🚪', 'Sign out'],
  signout_all: ['📵', 'Sign out from all devices'],
  deactivate: ['🗑️', 'Deactivate account'],
};
const labelOf = (k, me) => (k === 'plans' ? plansLabel(me) : LABELS[k] || ['•', k]);

function menuRows(me) {
  const hasKids = me.children.length > 0;
  const w = me.window?.state;
  return [
    ['profile', 'Name, email, mobile and children'],
    me.paused ? ['resume', 'QuizPe is paused — switch quizzes and reminders back on'] : null,
    me.comeback && !me.subscribed ? ['comeback', `Welcome back — ${me.comeback.days} days free, no payment`] : null,
    me.subscribed && hasKids ? ['quiz', w === 'open' ? `Open now — until ${fmtTime(me.window.closes)}` : w === 'before' ? `Arrives at ${fmtTime(me.window.opens)}` : "Today's has closed — next one tomorrow"] : null,
    me.can_start_trial ? ['trial', `${me.trial_days || 7} days free · no payment details needed`] : null,
    ['schedule', 'When the next quizzes arrive'],
    ['subscription', 'Plan, validity and children enrolled'],
    hasKids || me.status === 'EXPIRED' ? ['reports', 'Scores, report cards and invoices'] : null,
    ['plans', me.status === 'EXPIRED' ? 'Your plan ended — renew to continue' : me.subscribed ? 'Renew early or change plan' : 'Choose a plan to start daily quizzes'],
    ['notifications', 'Quiz-ready alerts on this phone, and email'],
    ['support', 'Ask us anything — we reply by email'],
    install.standalone() ? null : ['install', 'QuizPe on your home screen'],
    ['signout', 'Sign out on this device'],
    ['signout_all', 'Every phone and computer signed in'],
    ['deactivate', 'Stop QuizPe and close this account'],
  ].filter(Boolean);
}

function MenuList({ me, onGo }) {
  return (
    <div className="divide-y divide-line">
      {menuRows(me).map(([k, sub]) => {
        const [icon, label] = labelOf(k, me);
        const quiet = ['signout', 'signout_all', 'deactivate'].includes(k);
        return (
          <button key={k} type="button" data-test={`menu-${k}`} onClick={() => onGo(k)}
            className="w-full flex items-center gap-3 py-3 text-left active:bg-brand/5">
            <span className="text-xl leading-none w-7 text-center" aria-hidden="true">{icon}</span>
            <span className="min-w-0">
              <span className={`block font-bold text-sm ${k === 'deactivate' ? 'text-red-700' : quiet ? 'text-muted' : 'text-ink'}`}>{label}</span>
              <span className="block text-xs text-muted mt-0.5">{sub}</span>
            </span>
            <span className="ml-auto text-muted" aria-hidden="true">›</span>
          </button>
        );
      })}
    </div>
  );
}

/* The menu as a sheet over the page, from the header's ☰ Menu. */
function MenuSheet({ me, onGo, onClose }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose} data-test="menu-sheet">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-y-auto px-5 pt-4 pb-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center">
          <h2 className="font-extrabold text-brand text-lg">☰ Main menu</h2>
          <button className="ml-auto text-sm font-bold text-muted px-2" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <MenuList me={me} onGo={(k) => { onClose(); onGo(k); }} />
      </div>
    </div>
  );
}

/* Tappable replies under every answer — the web's reply buttons. */
function Replies({ me, keys, onGo }) {
  const list = [...new Set(keys.filter(Boolean))];
  return (
    <div className="mt-3 flex flex-wrap gap-2" data-test="replies">
      {list.map((k) => {
        const [icon, label] = labelOf(k, me);
        return (
          <button key={k} type="button" data-test={`reply-${k}`} onClick={() => onGo(k)}
            className="rounded-full border border-brand/30 bg-white px-3.5 py-2 text-sm font-bold text-brand active:scale-[.98] hover:bg-brand/5">
            {icon} {label}
          </button>
        );
      })}
    </div>
  );
}

/* One of the menu's answers, with the way back. */
function Panel({ me, title, replies, onGo, children, test }) {
  return (
    <div className="space-y-3" data-test={test}>
      <button className="text-sm font-bold text-brand" onClick={() => onGo('home')}>← Home</button>
      {title ? <h1 className="text-xl font-extrabold text-brand">{title}</h1> : null}
      {children}
      <Replies me={me} keys={[...(replies || []), 'menu', 'home']} onGo={onGo} />
    </div>
  );
}

/* --------------------------------------------- today, for each child */
const childState = (c, me) => {
  const t = c.today;
  const w = me.window?.state;
  if (!t || !t.total) return { key: 'soon', text: '⏳ Quizzes arriving soon' };
  if (!t.has_next) return { key: 'done', text: `✅ All ${t.total > 1 ? `${t.total} quizzes` : 'of today'} done` };
  if (w === 'before') return { key: 'before', text: `⏳ Not taken yet — arrives at ${fmtTime(me.window.opens)}` };
  if (w === 'closed') return { key: 'closed', text: t.done ? `${t.done} of ${t.total} done · closed for today` : '❌ Missed today — the next one opens tomorrow' };
  return { key: 'ready', text: t.done ? `🧠 ${t.done} of ${t.total} done — the next one is ready` : '🧠 Not taken yet — ready now' };
};
const readyKids = (me) => (me.subscribed && !me.paused ? me.children.filter((c) => childState(c, me).key === 'ready') : []);

/*
 * THE DASHBOARD'S STATUS (user, 2026-10-10): where QuizPe stands right now, in one card —
 * today's quiz (taken or not, with the button to start it), the plan expired x days ago
 * (with the plans), the trial to start, a plan not begun yet or a quiz not arrived yet
 * ("arriving soon"), or QuizPe paused.
 */
function StatusCard({ me, onGo }) {
  const plan = me.plan;
  const hasKids = me.children.length > 0;
  let tone = 'brand';
  let head;
  let body = null;
  let keys = [];
  if (me.paused) {
    tone = 'amber';
    head = '⏸ QuizPe is paused';
    body = 'No quizzes, reminders or messages are sent while it is paused.';
    keys = ['resume', 'support'];
  } else if (me.comeback && !me.subscribed) {
    // THE COMEBACK OFFER (2026-10-10): a lapsed family restarts free, once — when switched on in the admin.
    tone = 'gift';
    head = `🎁 Welcome back! ${me.comeback.days} days of QuizPe, free`;
    body = `${me.children.length > 1 ? 'Your children’s' : 'Your child’s'} daily quizzes start again today — no payment, nothing to fill in. ${plan?.ends ? `Your last plan ended on ${fmtDate(plan.ends)}.` : ''}`;
    keys = ['comeback', 'plans'];
  } else if (me.status === 'EXPIRED' && !me.subscribed) {
    tone = 'red';
    const n = plan?.ended_days_ago;
    head = `⌛ Your ${plan?.trial ? 'free trial' : `${plan?.name || ''} plan`} expired ${n === 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`}`;
    body = `It ended on ${fmtDate(plan?.ends)}. Renew to continue the daily quizzes — ${me.children.length > 1 ? 'the children’s' : 'your child’s'} progress so far is kept.`;
    keys = ['plans', 'subscription', 'reports'];
  } else if (me.can_start_trial) {
    head = `🎁 Start your free ${me.trial_days || 7}-day trial`;
    body = 'A 5-minute quiz every day, with a report after each one. No payment details needed.';
    keys = ['trial', 'plans'];
  } else if (!me.subscribed) {
    head = '💎 No active plan';
    body = 'Choose a plan to start the daily quizzes.';
    keys = ['plans', 'support'];
  } else if (plan?.not_started) {
    head = `🗓 Your plan starts on ${fmtDate(plan.starts)}`;
    body = 'The first quiz arrives soon — we will let you know the moment it is ready.';
    keys = ['schedule', 'notifications'];
  } else if (!hasKids) {
    head = '⏳ Quizzes arriving soon';
    body = 'Your child’s daily quizzes will appear here.';
    keys = ['support'];
  } else {
    const states = me.children.map((c) => [c, childState(c, me)]);
    const ready = states.filter(([, s]) => s.key === 'ready');
    const w = me.window?.state;
    head = ready.length ? "🧠 Today's quiz is ready"
      : states.every(([, s]) => s.key === 'done') ? "✅ All of today's quizzes are done"
        : w === 'before' ? `⏳ Today's quiz arrives soon — at ${fmtTime(me.window.opens)}`
          : w === 'closed' ? `🌙 Today's quiz has closed — the next one opens tomorrow at ${fmtTime(me.window.opens)}`
            : '⏳ Quizzes arriving soon';
    body = (
      <ul className="mt-1 space-y-1">
        {states.map(([c, s]) => <li key={c.id}><b className="text-ink">{c.name}</b> · {s.text}</li>)}
      </ul>
    );
    keys = ready.length ? ['quiz', 'schedule'] : ['reports', 'schedule'];
    if (plan && plan.days_left != null && plan.days_left <= 7) keys.push('plans');
  }
  const ring = tone === 'red' ? 'border-red-200 bg-red-50/60' : tone === 'amber' ? 'border-amber-200 bg-amber-50/60'
    : tone === 'gift' ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-emerald-50' : 'border-brand/20 bg-white';
  return (
    <div className={`rounded-3xl border-2 p-5 shadow-sm ${ring}`} data-test="status-card">
      <div className="font-extrabold text-ink text-lg leading-snug">{head}</div>
      {body ? <div className="text-sm text-muted mt-1">{body}</div> : null}
      {me.subscribed && plan && !plan.not_started ? (
        <div className="text-xs text-muted mt-2">{plan.trial ? 'Free trial' : plan.name} · till {fmtDate(plan.ends)}{plan.days_left != null && plan.days_left >= 0 ? ` · ${plan.days_left} day${plan.days_left === 1 ? '' : 's'} left` : ''}</div>
      ) : null}
      <Replies me={me} keys={keys} onGo={onGo} />
    </div>
  );
}

/* Starting a child's quiz — the same steps from the pop-up and the child's card. */
function useStarter(onMessage) {
  const [busy, setBusy] = useState(null);
  const [levels, setLevels] = useState({});
  const start = async (child, level) => {
    setBusy(child.id);
    try {
      const r = await app.startQuiz(child.id, level);
      if (r.url) { window.location.href = r.url; return; }
      if (r.ask_level) { setLevels((m) => ({ ...m, [child.id]: r.ask_level })); setBusy(null); return; }
      onMessage({ tone: r.done ? 'good' : 'info', text: r.message, replies: ['schedule', 'reports'] });
    } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy(null);
  };
  return { busy, levels, start };
}

/*
 * "QUIZ IS READY" (user, 2026-10-10): a pop-up when today's quiz is ready — on opening
 * the app, when the quiz window opens while it is open, and from the phone notification
 * (?open=quiz). A tap opens the usual quiz page. "Later" closes it for today; the
 * dashboard's status card keeps the Start button. From the menu (Start quiz now) it
 * shows every child, ready or not.
 */
function QuizPopup({ me, onClose, onMessage, onGo }) {
  const { busy, levels, start } = useStarter((m) => { onClose(); onMessage(m); });
  const ready = readyKids(me);
  const open = me.window?.state === 'open';
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose} data-test="quiz-popup">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl px-5 pt-5 pb-6 qp-pop" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-4xl" aria-hidden="true">{ready.length ? '🧠' : open ? '✅' : '⏳'}</div>
          <h2 className="font-extrabold text-brand text-xl mt-1">
            {!me.subscribed ? 'No active plan' : ready.length ? "Today's quiz is ready!" : open ? "All of today's quizzes are done" : me.window?.state === 'before' ? `Today's quiz arrives at ${fmtTime(me.window.opens)}` : "Today's quiz has closed"}
          </h2>
          <p className="text-sm text-muted mt-1">
            {!me.subscribed ? (me.status === 'EXPIRED' ? 'Your plan has ended. Renew it to continue the daily quizzes.' : 'Start the free trial or choose a plan to begin the daily quizzes.')
              : ready.length ? `About 5 minutes · open until ${fmtTime(me.window.closes)} · the report comes the moment it's done.`
                : me.window?.state === 'before' ? 'We will let you know the moment it is ready.' : `The next one opens tomorrow at ${fmtTime(me.window.opens)}.`}
          </p>
        </div>
        {me.subscribed ? (
          <div className="mt-4 space-y-2">
            {me.children.map((c) => {
              const s = childState(c, me);
              const lv = levels[c.id];
              return (
                <div key={c.id} className="rounded-2xl border border-line px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-ink">{c.name}</div>
                      <div className="text-xs text-muted">{s.text}</div>
                    </div>
                    {s.key === 'ready' && !lv ? (
                      <button className="btn-wa !px-4 !py-2 !text-sm ml-auto shrink-0" data-test={`quiz-start-${c.id}`} disabled={busy != null} onClick={() => start(c)}>
                        {busy === c.id ? 'Opening…' : c.today?.done ? '▶ Next quiz' : '▶ Start'}
                      </button>
                    ) : null}
                  </div>
                  {lv ? (
                    <div className="mt-3">
                      <div className="text-sm font-semibold text-ink mb-2">How hard should today be?</div>
                      <div className="grid grid-cols-3 gap-2">
                        {lv.map((l) => <button key={l.level} className="btn-ghost !px-2 !py-2.5" disabled={busy != null} onClick={() => start(c, l.level)}>{l.label}</button>)}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {!me.subscribed ? <button className="btn-wa !px-4 !py-2 !text-sm" onClick={() => { onClose(); onGo('plans'); }}>{plansLabel(me).join(' ')}</button> : null}
          {me.subscribed && !ready.length ? <button className="btn-ghost !px-4 !py-2 !text-sm" onClick={() => { onClose(); onGo('reports'); }}>📊 My reports</button> : null}
          <button className="btn-ghost !px-4 !py-2 !text-sm" data-test="quiz-later" onClick={onClose}>{ready.length ? 'Later' : 'Close'}</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- profile */
/*
 * MY PROFILE (user, 2026-10-10): the student's name first — it is the name at the top of
 * the app, on every quiz and on every report — then the student's details (school, board,
 * medium, grade), the parent's name and the email that gets the alerts (quiz arrival,
 * reports, invoices), and ONE Update button for all of it. Board and grade change the
 * question bank, so they are changed by us on request (Help & support).
 */
function Profile({ me, onSaved, onMessage }) {
  const [kids, setKids] = useState(() => Object.fromEntries(me.children.map((c) => [c.id, c.name])));
  const [name, setName] = useState(me.parent?.name || '');
  const [email, setEmail] = useState(me.parent?.email || '');
  const [busy, setBusy] = useState(false);
  const kidsChanged = me.children.filter((c) => String(kids[c.id] || '').trim() !== c.name);
  const meChanged = name.trim() !== String(me.parent?.name || '') || email.trim().toLowerCase() !== String(me.parent?.email || '');
  const dirty = kidsChanged.length > 0 || meChanged;
  const save = async (e) => {
    e.preventDefault(); onMessage(null);
    if (kidsChanged.some((c) => String(kids[c.id] || '').trim().length < 2)) { onMessage({ tone: 'error', text: "Please enter the student's name." }); return; }
    if (name.trim().length < 2) { onMessage({ tone: 'error', text: 'Please enter your name.' }); return; }
    if (!EMAIL_RE.test(email.trim())) { onMessage({ tone: 'error', text: 'Please enter a valid email address — quiz alerts, reports and invoices are sent there.' }); return; }
    setBusy(true);
    try {
      for (const c of kidsChanged) await app.childName(c.id, kids[c.id].trim());
      if (meChanged) await app.profile({ name: name.trim(), email: email.trim() });
      onMessage({ tone: 'good', text: '✅ Profile updated.', replies: ['subscription', 'notifications'] });
      onSaved();
    } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy(false);
  };
  return (
    <form onSubmit={save} className="space-y-4" data-test="profile">
      {me.children.map((c, i) => (
        <div key={c.id} className="card p-5">
          <label className="label" htmlFor={`pf-k${c.id}`}>{me.children.length > 1 ? `Student ${i + 1} — name` : "Student's name"}</label>
          <input id={`pf-k${c.id}`} className="input font-bold" maxLength={40} value={kids[c.id] || ''} onChange={(e) => setKids({ ...kids, [c.id]: e.target.value })} />
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            <div><dt className="text-xs text-muted">School</dt><dd className="font-semibold text-ink">{c.school || '—'}</dd></div>
            <div><dt className="text-xs text-muted">Grade</dt><dd className="font-semibold text-ink">{c.grade || '—'}</dd></div>
            <div><dt className="text-xs text-muted">Board</dt><dd className="font-semibold text-ink">{c.board_name || c.board || '—'}</dd></div>
            <div><dt className="text-xs text-muted">Medium</dt><dd className="font-semibold text-ink">{c.medium || '—'}</dd></div>
            {c.can_choose_level ? <div><dt className="text-xs text-muted">Quiz level</dt><dd className="font-semibold text-ink">{c.last_level || 'Asked before each quiz'}</dd></div> : null}
          </dl>
        </div>
      ))}
      {!me.children.length ? <div className="card p-5 text-sm text-muted">No student added yet — the free trial or a plan starts with your child's details.</div> : null}
      <div className="card p-5">
        <label className="label" htmlFor="pf-n">Parent's name</label>
        <input id="pf-n" className="input" maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="label mt-3" htmlFor="pf-e">Email for alerts</label>
        <input id="pf-e" type="email" className="input" maxLength={120} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <p className="text-[11px] text-muted mt-1">📬 Quiz arrival alerts, reports, invoices and plan reminders are sent here.</p>
        <div className="label mt-3">Mobile number</div>
        <div className="text-sm text-ink tabular-nums">+91 {me.mobile.slice(0, 5)} {me.mobile.slice(5)} <span className="text-xs text-muted">· your sign-in</span></div>
      </div>
      <button className="btn-wa w-full disabled:opacity-50" data-test="profile-save" disabled={busy || !dirty}>{busy ? 'Updating…' : dirty ? '✅ Update' : 'Up to date'}</button>
      {me.children.length ? <p className="text-xs text-muted text-center">To change the school, board or grade, write to us from 💬 Help & support.</p> : null}
    </form>
  );
}

/*
 * MY SUBSCRIPTION (2026-10-10): the current plan on top — dates, days left, the children
 * it covers, its invoice — then the earlier ones.
 */
function Subscriptions() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { app.subscriptions().then(setD).catch((x) => setErr(x.message)); }, []);
  if (err) return <Note tone="error">{err}</Note>;
  if (!d) return <div className="card p-5 text-sm text-muted">Loading your subscriptions…</div>;
  if (!d.subscriptions.length) return <div className="card p-5 text-sm text-ink" data-test="subs">You have no subscription yet. Start the free trial or choose a plan to begin the daily quizzes.</div>;
  const badge = { current: ['bg-emerald-100 text-emerald-800', 'Active'], upcoming: ['bg-sky-100 text-sky-800', 'Starts soon'], ended: ['bg-gray-100 text-gray-700', 'Ended'], cancelled: ['bg-red-100 text-red-800', 'Cancelled'] };
  return (
    <div className="space-y-3" data-test="subs">
      {d.subscriptions.map((s, i) => {
        const [cls, label] = badge[s.state] || badge.ended;
        const big = i === 0 || s.state === 'current' || s.state === 'upcoming';
        return (
          <div key={s.id} className={`card ${big ? 'p-5' : 'px-5 py-3'}`}>
            <div className="flex items-center gap-2">
              <div className={`font-extrabold text-ink ${big ? 'text-lg' : 'text-sm'}`}>{s.trial ? '🎁 Free trial' : s.plan}</div>
              <span className={`ml-auto text-[11px] font-bold rounded-full px-2.5 py-1 ${cls}`}>{label}</span>
            </div>
            <div className="text-sm text-muted mt-1">{fmtDate(s.starts)} → {fmtDate(s.ends)}</div>
            {s.state === 'current' ? <div className="text-sm font-bold text-brand mt-1">{s.days_left} day{s.days_left === 1 ? '' : 's'} left</div> : null}
            {s.state === 'ended' && s.ended_days_ago != null ? <div className="text-sm font-semibold text-red-700 mt-1">Expired {s.ended_days_ago === 0 ? 'today' : s.ended_days_ago === 1 ? 'yesterday' : `${s.ended_days_ago} days ago`}</div> : null}
            {big ? (
              <div className="text-xs text-muted mt-2">
                {s.seats ? `For up to ${s.seats} child${s.seats > 1 ? 'ren' : ''}` : ''}{d.children.length ? ` · ${d.children.join(', ')}` : ''}{s.days ? ` · ${s.days}-day plan` : ''}
              </div>
            ) : null}
            {s.invoice ? (
              <a href={s.invoice.url} target="_blank" rel="noopener" className="inline-block mt-2 text-xs font-bold text-brand-accent">🧾 Invoice {s.invoice.number}{s.invoice.total != null ? ` · ${rupees(s.invoice.total)}` : ''} ↓</a>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------- sign out everywhere, deactivate */
function SignOutAll({ onDone, onMessage }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try { const r = await app.signOutAll(); onDone(r.ended); return; } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy(false);
  };
  return (
    <div className="card p-5" data-test="signout-all">
      <p className="text-sm text-ink">This signs you out on <b>every</b> phone and computer — this one too — and turns off QuizPe notifications on them. Your children, plan and reports are not touched; sign in again with an SMS code any time.</p>
      <button className="btn-wa w-full mt-4" disabled={busy} data-test="signout-all-go" onClick={go}>{busy ? 'Signing out…' : '📵 Yes, sign out everywhere'}</button>
    </div>
  );
}

const REASONS = [
  'My child does not use it any more',
  'It is too expensive',
  'Too many reminders',
  'The questions do not suit my child',
  'Technical problems',
  'Other',
];
function Deactivate({ me, onDone, onMessage, onGo }) {
  const [why, setWhy] = useState('');
  const [more, setMore] = useState('');
  const [sure, setSure] = useState(false);
  const [busy, setBusy] = useState(false);
  const reason = [why, more.trim()].filter(Boolean).join(' — ');
  const go = async () => {
    onMessage(null);
    if (!why || (why === 'Other' && more.trim().length < 3)) { onMessage({ tone: 'error', text: 'Please tell us why — it helps us improve.' }); return; }
    setBusy(true);
    try { await app.deactivate(reason); onDone(); return; } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy(false);
  };
  const paidDays = me.subscribed && me.plan && !me.plan.trial && me.plan.days_left > 0;
  return (
    <div className="card p-5" data-test="deactivate">
      <p className="text-sm text-ink">We are sorry to see you go. Deactivating:</p>
      <ul className="mt-2 text-sm text-ink space-y-1 list-disc pl-5">
        <li>stops the daily quizzes, reminders, emails and notifications</li>
        <li>signs you out on every device</li>
        <li>keeps the reports and invoices (invoices must be kept by law)</li>
        {paidDays ? <li><b>does not refund or pause your plan</b> — its {me.plan.days_left} remaining day{me.plan.days_left === 1 ? '' : 's'} keep running</li> : null}
        <li>can be undone: just sign in again with this number</li>
      </ul>
      <div className="label mt-4">Why are you leaving? *</div>
      <div className="mt-1 space-y-1.5">
        {REASONS.map((r) => (
          <label key={r} className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
            <input type="radio" name="why" className="w-4 h-4 accent-[#00a884]" checked={why === r} onChange={() => setWhy(r)} /> {r}
          </label>
        ))}
      </div>
      <textarea className="input mt-3 min-h-[72px]" maxLength={250} placeholder={why === 'Other' ? 'Please tell us more *' : 'Anything else? (optional)'} value={more} onChange={(e) => setMore(e.target.value)} />
      {why === 'Too many reminders' ? (
        <Note>You can turn the phone notifications off instead, and keep the quizzes. <button className="underline font-semibold" onClick={() => onGo('notifications')}>Notifications</button></Note>
      ) : null}
      <label className="flex items-start gap-2.5 text-sm text-ink cursor-pointer mt-3">
        <input type="checkbox" className="mt-1 w-4 h-4 accent-[#b91c1c]" checked={sure} onChange={(e) => setSure(e.target.checked)} />
        <span>I understand — deactivate my QuizPe account.</span>
      </label>
      <button className="w-full mt-3 rounded-full bg-red-700 text-white font-bold py-3 disabled:opacity-50" disabled={busy || !sure || !why} data-test="deactivate-go" onClick={go}>
        {busy ? 'Deactivating…' : '🗑️ Deactivate my account'}
      </button>
    </div>
  );
}

/* "My subscription" / "Quiz schedule": the bot's own answer, in a card. */
function InfoCard({ what, onClose }) {
  const [text, setText] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setText(null); setErr(''); app.info(what).then((r) => setText(r.text)).catch((x) => setErr(x.message)); }, [what]);
  return (
    <div className="card p-4" data-test={`info-${what}`}>
      <div className="text-sm text-ink leading-relaxed">{err ? <span className="text-red-700">{err}</span> : text == null ? 'Loading…' : <BotText text={text} />}</div>
      {onClose ? <button className="btn-ghost !px-4 !py-2 !text-sm mt-3" onClick={onClose}>Close</button> : null}
    </div>
  );
}

function Note({ tone = 'info', children }) {
  const cls = tone === 'error' ? 'bg-red-50 border-red-200 text-red-800'
    : tone === 'good' ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : 'bg-amber-50 border-amber-200 text-amber-900';
  return <div role="status" className={`rounded-2xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

/* ------------------------------------------------------------- sign in */
function SignIn({ onDone, note }) {
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const send = async (e) => {
    e?.preventDefault();
    setErr('');
    const m = mobile.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(m)) { setErr('Enter your 10-digit mobile number.'); return; }
    setBusy(true);
    try { await app.sendCode(m); setMobile(m); setSent(true); } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  const verify = async (e) => {
    e.preventDefault();
    setErr('');
    if (!terms) { setErr('Please accept the Terms and Privacy Policy to continue.'); return; }
    if (!/^\d{6}$/.test(code.trim())) { setErr('Enter the 6-digit code from the SMS.'); return; }
    setBusy(true);
    try { const r = await app.verify(mobile, code.trim(), terms); appToken.set(r.token); onDone(r); } catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <div className="card p-6">
      {note ? <div className="mb-4"><Note tone="good">{note}</Note></div> : null}
      <h1 className="text-2xl font-extrabold text-brand">Sign in to QuizPe</h1>
      <p className="text-xs text-muted mt-1">📢 <i>{WEB_NOTE}</i></p>
      <p className="text-sm text-muted mt-1">Daily 5-minute quizzes for your child, with a full report after each one. Use the mobile number you use for QuizPe — new here? The same step starts your free trial.</p>
      {!sent ? (
        <form onSubmit={send} className="mt-5 space-y-3">
          <label className="label" htmlFor="m">Mobile number</label>
          <div className="flex gap-2">
            <span className="input !w-auto text-muted">+91</span>
            <input id="m" className="input" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile"
                   value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} />
          </div>
          <button className="btn-wa w-full" disabled={busy}>{busy ? 'Sending…' : 'Send code by SMS'}</button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-5 space-y-3">
          <p className="text-sm text-muted">We sent a 6-digit code by SMS to <b className="text-ink">+91 {mobile}</b>. <button type="button" className="underline font-semibold text-brand" onClick={() => { setSent(false); setCode(''); }}>Change</button></p>
          <label className="label" htmlFor="c">Code</label>
          <input id="c" className="input tracking-[0.4em] text-lg" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••"
                 value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
          <label className="flex items-start gap-2.5 text-sm text-ink cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 accent-[#00a884]" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>I agree to the QuizPe <a href="/terms" target="_blank" rel="noopener" className="underline font-semibold">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener" className="underline font-semibold">Privacy Policy</a>.</span>
          </label>
          <button className="btn-wa w-full" disabled={busy || !terms}>{busy ? 'Checking…' : 'Sign in'}</button>
          <button type="button" className="w-full text-sm font-semibold text-brand" disabled={busy} onClick={send}>Send the code again</button>
        </form>
      )}
      {err ? <div className="mt-3"><Note tone="error">{err}</Note></div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ children */
function ChildCard({ child, me, onMessage }) {
  const [busy, setBusy] = useState(false);
  const [levels, setLevels] = useState(null);
  const start = async (level) => {
    setBusy(true); onMessage(null);
    try {
      const r = await app.startQuiz(child.id, level);
      if (r.url) { window.location.href = r.url; return; }
      if (r.ask_level) { setLevels(r.ask_level); setBusy(false); return; }
      onMessage({ tone: r.done ? 'good' : 'info', text: r.message, replies: ['schedule', 'reports'] });
    } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy(false);
  };
  const t = child.today;
  const open = me.window?.state === 'open';
  const canStart = me.subscribed && open && t?.has_next;
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-brand-accent/10 text-brand font-extrabold text-lg flex items-center justify-center shrink-0">{child.name.slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0">
          <div className="font-extrabold text-ink text-lg leading-tight">{child.name}</div>
          <div className="text-xs text-muted">{child.board} · {child.grade}{child.school ? ` · ${child.school}` : ''}</div>
        </div>
        {t ? <div className="ml-auto text-right shrink-0"><div className="text-xl font-extrabold text-brand tabular-nums">{t.done}/{t.total}</div><div className="text-[11px] text-muted">today</div></div> : null}
      </div>
      {levels ? (
        <div className="mt-4">
          <div className="text-sm font-semibold text-ink mb-2">How hard should today be?</div>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((l) => <button key={l.level} className="btn-ghost !px-2 !py-2.5" disabled={busy} onClick={() => start(l.level)}>{l.label}</button>)}
          </div>
        </div>
      ) : me.subscribed ? (
        <div className="mt-4">
          {canStart ? (
            <button className="btn-wa w-full" disabled={busy} onClick={() => start()}>{busy ? 'Opening…' : t?.done ? `▶ Start quiz ${t.done + 1} of ${t.total}` : "▶ Start today's quiz"}</button>
          ) : t && !t.has_next ? (
            <Note tone="good">All of today's quizzes are done — brilliant! The next one opens tomorrow at {fmtTime(me.window?.opens)}.</Note>
          ) : !open ? (
            <Note>{me.window?.state === 'before' ? `Today's quiz opens at ${fmtTime(me.window?.opens)}.` : `Today's quiz has closed. The next one opens tomorrow at ${fmtTime(me.window?.opens)}.`}</Note>
          ) : null}
          <p className="text-[11px] text-muted mt-2">Open {fmtTime(me.window?.opens)} – {fmtTime(me.window?.closes)} · about 5 minutes · the report comes the moment it's done.</p>
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- plans */
/*
 * TWO WAYS TO PAY (2026-10-02 on WhatsApp, kept on the web 2026-10-08): pay now,
 * or send the link to whoever is paying — a spouse, a grandparent. The link
 * works for a set time, needs no sign-in, and switches the plan on for THIS
 * parent's number.
 */
function ShareLink({ link, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = `Please pay for my child's QuizPe plan (${link.plan}) here. It switches on for my number — nothing else to do: ${link.url}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link.url); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* select it by hand */ }
  };
  const share = async () => {
    try { await navigator.share({ title: 'QuizPe payment', text }); } catch { /* cancelled */ }
  };
  return (
    <div className="mt-3 rounded-2xl border-2 border-brand-accent/40 bg-brand-accent/5 p-4">
      <div className="font-bold text-ink">🔗 Payment link for {link.plan}</div>
      <p className="text-xs text-muted mt-1">Send this to whoever is paying. They fill in the details and pay; the plan switches on for <b>your</b> number. The link works for <b>{link.validFor}</b>.</p>
      <input readOnly className="input mt-2 text-xs" value={link.url} onFocus={(e) => e.target.select()} />
      <div className="mt-2 flex gap-2">
        {typeof navigator !== 'undefined' && navigator.share ? <button className="btn-wa !px-4 !py-2 !text-sm flex-1" onClick={share}>Share link</button> : null}
        <button className="btn-ghost !px-4 !py-2 !text-sm flex-1" onClick={copy}>{copied ? 'Copied ✓' : 'Copy link'}</button>
      </div>
      <button className="mt-2 text-xs font-semibold text-muted underline" onClick={onClose}>Close</button>
    </div>
  );
}

function Plans({ me, onMessage, title }) {
  const [busy, setBusy] = useState('');
  const [picked, setPicked] = useState('');
  const [link, setLink] = useState(null);
  const buy = async (code, someoneElse = false) => {
    setBusy(code); onMessage(null);
    try {
      const r = await app.checkout(code, someoneElse);
      if (!someoneElse) { window.location.href = r.url; return; }
      setLink({ url: r.url, validFor: r.valid_for, plan: me.plans.find((p) => p.code === code)?.name || 'QuizPe' });
      setPicked('');
    } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy('');
  };
  return (
    <div className="card p-5">
      <h2 className="font-extrabold text-brand text-lg">{title}</h2>
      <p className="text-xs text-muted mt-0.5">Every plan: daily quizzes, explanations, spiral revision and PDF report cards. Prices include GST · secure payment by Razorpay.</p>
      <div className="mt-3 space-y-2">
        {me.plans.map((p) => (
          <div key={p.code} data-test={`plan-${p.code}`} className={`rounded-2xl border px-4 py-3 ${picked === p.code ? 'border-brand-accent bg-brand-accent/5' : 'border-line'}`}>
            {/* A tap anywhere on the plan opens the payment choices (2026-10-10). */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { if (!busy) setPicked(picked === p.code ? '' : p.code); }}>
              <div className="min-w-0">
                <div className="font-bold text-ink">{p.name}</div>
                <div className="text-xs text-muted">{p.children} child{p.children > 1 ? 'ren' : ''} · {p.days} days</div>
              </div>
              <div className="ml-auto text-right">
                {p.was > p.price ? <div className="text-[11px] text-muted line-through">{rupees(p.was)}</div> : null}
                <div className="font-extrabold text-brand">{rupees(p.price)}</div>
              </div>
              <button className="btn-wa !px-4 !py-2 !text-sm" disabled={Boolean(busy)}>{picked === p.code ? 'Close' : me.status === 'EXPIRED' ? 'Renew' : 'Choose'}</button>
            </div>
            {picked === p.code ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="btn-wa !px-3 !py-2.5 !text-sm" disabled={Boolean(busy)} onClick={() => buy(p.code)}>{busy === p.code ? '…' : '💳 Pay now'}</button>
                <button className="btn-ghost !px-3 !py-2.5 !text-sm" disabled={Boolean(busy)} onClick={() => buy(p.code, true)}>🔗 Someone else will pay</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {link ? <ShareLink link={link} onClose={() => setLink(null)} /> : null}
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function StartTrial({ me, onMessage }) {
  const [name, setName] = useState(me.parent?.name || '');
  const [email, setEmail] = useState(me.parent?.email || '');
  const [busy, setBusy] = useState(false);
  const go = async (e) => {
    e.preventDefault(); onMessage(null);
    if (name.trim().length < 2) { onMessage({ tone: 'error', text: 'Please enter your name.' }); return; }
    if (!EMAIL_RE.test(email.trim())) { onMessage({ tone: 'error', text: 'Please enter a valid email address — reminders and reports are sent there.' }); return; }
    setBusy(true);
    try { const r = await app.trial(name.trim(), email.trim()); window.location.href = r.url; return; } catch (x) { onMessage({ tone: 'error', text: x.message }); }
    setBusy(false);
  };
  return (
    <form onSubmit={go} className="card p-5">
      <h2 className="font-extrabold text-brand text-lg">🎁 Start your free {me.trial_days || 7}-day trial</h2>
      <p className="text-sm text-muted mt-1">No payment details needed. Next you add your child's name, board, medium and grade — it takes about 30 seconds.</p>
      <label className="label mt-4" htmlFor="pn">Your name *</label>
      <input id="pn" className="input" maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Parent's name" />
      <label className="label mt-3" htmlFor="pe">Your email *</label>
      <input id="pe" type="email" className="input" maxLength={120} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <p className="text-[11px] text-muted mt-1">Quiz reminders, reports and plan notices are sent here.</p>
      <button className="btn-wa w-full mt-3" disabled={busy || name.trim().length < 2 || !EMAIL_RE.test(email.trim())}>{busy ? 'Opening…' : "Next: my child's details"}</button>
    </form>
  );
}

/** Families already enrolled but with no email give one before anything else (2026-10-08). */
function EmailGate({ me, onSaved }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const save = async (e) => {
    e.preventDefault(); setErr('');
    if (!EMAIL_RE.test(email.trim())) { setErr('Please enter a valid email address.'); return; }
    setBusy(true);
    try { await app.profile({ email: email.trim() }); onSaved(); return; } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  return (
    <form onSubmit={save} className="card p-5">
      <h2 className="font-extrabold text-brand text-lg">📧 One quick step</h2>
      <p className="text-sm text-muted mt-1">Add your email to continue. Quiz reminders, {me.children.length > 1 ? 'your children’s' : 'your child’s'} reports and plan notices are sent there.</p>
      <label className="label mt-4" htmlFor="ge">Your email *</label>
      <input id="ge" type="email" className="input" maxLength={120} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <button className="btn-wa w-full mt-3" disabled={busy || !EMAIL_RE.test(email.trim())}>{busy ? 'Saving…' : 'Save and continue'}</button>
      {err ? <div className="mt-3"><Note tone="error">{err}</Note></div> : null}
    </form>
  );
}

/* ------------------------------------------------------ reports, invoices */
function Reports() {
  const [d, setD] = useState(null);
  const [all, setAll] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { app.reports().then(setD).catch((x) => setErr(x.message)); }, []);
  if (err) return <Note tone="error">{err}</Note>;
  if (!d) return <div className="card p-5 text-sm text-muted">Loading reports…</div>;
  const list = all ? d.reports : d.reports.slice(0, 6);
  return (
    <>
      <div className="card p-5">
        <h2 className="font-extrabold text-brand text-lg">📊 Recent quiz reports</h2>
        <p className="text-xs text-muted mt-0.5">Tap a report to download its PDF — every question, the right answer and why.</p>
        {!d.reports.length ? <p className="text-sm text-muted mt-1">The first report appears here the moment a quiz is finished.</p> : (
          <div className="mt-3 divide-y divide-line">
            {list.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener" className="flex items-center gap-3 py-2.5">
                <span className="w-16 shrink-0 text-center font-extrabold text-brand text-xs leading-tight">{r.grade || '—'}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink truncate">{r.child} · {r.subject || 'Quiz'}{r.type === 'weekly' ? ' · weekly' : ''}</span>
                  <span className="block text-xs text-muted">{fmtDate(r.date)} · {r.score} ({r.pct}%)</span>
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-bold text-brand-accent">⬇ PDF</span>
              </a>
            ))}
          </div>
        )}
        {d.reports.length > 6 ? <button className="mt-2 text-sm font-semibold text-brand" onClick={() => setAll(!all)}>{all ? 'Show fewer' : `Show all ${d.reports.length}`}</button> : null}
      </div>
      {d.invoices.length ? (
        <div className="card p-5">
          <h2 className="font-extrabold text-brand text-lg">🧾 Invoices</h2>
          <div className="mt-2 divide-y divide-line">
            {d.invoices.map((i) => (
              <a key={i.url} href={i.url} target="_blank" rel="noopener" className="flex items-center gap-3 py-2.5 text-sm">
                <span className="min-w-0"><span className="block font-semibold text-ink">{i.number}</span><span className="block text-xs text-muted">{fmtDate(i.date)}{i.plan ? ` · ${i.plan}` : ''}</span></span>
                <span className="ml-auto font-bold text-ink">{i.total != null ? rupees(i.total) : ''}</span>
                <span className="shrink-0 rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-bold text-brand-accent">⬇ PDF</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

/* --------------------------------------------------- reminders: push, email */
const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const b64ToBytes = (s) => {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((ch) => ch.charCodeAt(0)));
};

function Reminders({ me, onGo }) {
  const [push, setPush] = useState('unknown');   // unknown | on | off | denied | unsupported
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!pushSupported()) { setPush('unsupported'); return; }
    if (Notification.permission === 'denied') { setPush('denied'); return; }
    navigator.serviceWorker.getRegistration('/app-sw.js')
      .then((reg) => (reg ? reg.pushManager.getSubscription() : null))
      .then((sub) => setPush(sub ? 'on' : 'off')).catch(() => setPush('off'));
  }, []);

  const turnOn = async () => {
    if (push === 'on') { setMsg({ tone: 'good', text: 'Notifications are already on for this phone.' }); return; }
    setBusy(true); setMsg(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { setPush(perm === 'denied' ? 'denied' : 'off'); setBusy(false); return; }
      const reg = await navigator.serviceWorker.register('/app-sw.js');
      await navigator.serviceWorker.ready;
      const { key } = await app.pushKey();
      const sub = (await reg.pushManager.getSubscription())
        || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
      await app.pushOn(sub.toJSON());
      setPush('on'); setMsg({ tone: 'good', text: 'Reminders are on for this phone.' });
    } catch (x) { setMsg({ tone: 'error', text: x.message || 'Could not turn reminders on.' }); }
    setBusy(false);
  };
  const turnOff = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration('/app-sw.js');
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) { await app.pushOff(sub.endpoint); await sub.unsubscribe(); }
      setPush('off');
    } catch { /* keep state */ }
    setBusy(false);
  };
  return (
    <div className="card p-5" data-test="notifications">
      <h2 className="font-extrabold text-brand text-lg">🔔 Notifications</h2>
      <p className="text-xs text-muted mt-0.5">One friendly nudge when today's quiz is ready, a note when a report is ready, and a reminder before the plan ends — nothing else.</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="text-sm min-w-0">
          <div className="font-semibold text-ink">Notifications on this phone</div>
          <div className="text-xs text-muted">{push === 'on' ? '✅ Already on for this phone' : push === 'denied' ? 'Blocked in your browser settings' : push === 'unsupported' ? 'Not supported here — on iPhone, add QuizPe to the Home Screen first' : 'Off'}</div>
        </div>
        {push === 'on' ? <button className="btn-ghost !px-4 !py-2 !text-sm ml-auto" disabled={busy} onClick={turnOff}>Turn off</button>
          : push === 'off' || push === 'unknown' ? <button className="btn-wa !px-4 !py-2 !text-sm ml-auto" disabled={busy} onClick={turnOn}>Turn on</button> : null}
      </div>
      {/* The email is set in the profile (2026-10-10); shown here so the parent sees both ways. */}
      <div className="mt-4 flex items-center gap-3">
        <div className="text-sm min-w-0">
          <div className="font-semibold text-ink">Email</div>
          <div className="text-xs text-muted break-all">{me.parent?.email ? `Reminders, reports and invoices go to ${me.parent.email}` : 'Not added yet'}</div>
        </div>
        <button className="btn-ghost !px-4 !py-2 !text-sm ml-auto shrink-0" onClick={() => onGo('profile')}>{me.parent?.email ? 'Change' : 'Add'}</button>
      </div>
      {msg ? <div className="mt-3"><Note tone={msg.tone}>{msg.text}</Note></div> : null}
    </div>
  );
}

/*
 * THIS WEEK + RECENT ACTIVITY (user, 2026-10-10: "you have the menu option — why show the
 * full menu again? show recent activities or more instead"). Each child's last 7 days
 * (quizzes, average, best, streak), then what happened lately: quizzes finished (tap for
 * the report), plans started and ended, and payments (tap for the invoice) — no sign-ins.
 */
const ago = (d) => {
  const s = Math.max(0, (Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 2 * 86400) return 'yesterday';
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} days ago`;
  return fmtDate(d);
};
function Activity({ me, onGo }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [all, setAll] = useState(false);
  useEffect(() => { app.activity().then(setD).catch((x) => setErr(x.message)); }, [me]);
  if (err) return null;
  if (!d) return <div className="card p-5 text-sm text-muted">Loading recent activity…</div>;
  const items = all ? d.activity : d.activity.slice(0, 6);
  const line = (a) => {
    if (a.kind === 'quiz') return [a.weekly ? '🗓️' : '🧠', `${a.child} ${a.weekly ? 'got the weekly report' : `finished ${a.subject || 'a quiz'}`}`, `${a.score} (${a.pct}%)${a.grade ? ` · ${a.grade}` : ''}`, a.url, '⬇ Report'];
    if (a.kind === 'payment') return ['💳', `Paid for ${a.plan || 'a plan'}`, `${a.total != null ? rupees(a.total) : ''} · invoice ${a.number}`, a.url, '⬇ Invoice'];
    if (a.kind === 'plan') return [a.trial ? '🎁' : '✨', a.trial ? 'Free trial started' : `${a.plan} started`, `${fmtDate(a.starts)} → ${fmtDate(a.ends)}`, null, null];
    return ['⌛', a.trial ? 'Free trial ended' : `${a.plan} ended`, '', null, null];
  };
  return (
    <>
      {d.week.length ? (
        <div className="card p-5" data-test="week">
          <h2 className="font-extrabold text-brand text-lg">📈 This week</h2>
          <div className="mt-3 space-y-3">
            {d.week.map((w) => (
              <div key={w.id}>
                {d.week.length > 1 ? <div className="text-sm font-bold text-ink mb-1.5">{w.child}</div> : null}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[[w.quizzes, w.quizzes === 1 ? 'quiz' : 'quizzes'], [w.avg_pct != null ? `${w.avg_pct}%` : '—', 'average'], [w.best_pct != null ? `${w.best_pct}%` : '—', 'best'], [`${w.streak}🔥`, w.streak === 1 ? 'day streak' : 'days streak']].map(([v, l]) => (
                    <div key={l} className="rounded-2xl bg-brand/5 px-1 py-2.5">
                      <div className="font-extrabold text-brand text-lg tabular-nums leading-none">{v}</div>
                      <div className="text-[11px] text-muted mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {d.week.every((w) => !w.quizzes) ? <p className="text-xs text-muted mt-3">No quiz in the last 7 days — a 5-minute quiz a day builds the habit.</p> : null}
        </div>
      ) : null}
      <div className="card p-5" data-test="activity">
        <h2 className="font-extrabold text-brand text-lg">🕘 Recent activity</h2>
        {!d.activity.length ? <p className="text-sm text-muted mt-1">Nothing yet — finished quizzes, plans and payments will show here.</p> : (
          <ul className="mt-2 divide-y divide-line">
            {items.map((a, i) => {
              const [icon, title, sub, url, action] = line(a);
              const body = (
                <>
                  <span className="text-lg w-7 text-center shrink-0" aria-hidden="true">{icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{title}</span>
                    <span className="block text-xs text-muted">{[sub, ago(a.at)].filter(Boolean).join(' · ')}</span>
                  </span>
                  {url ? <span className="ml-auto shrink-0 rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-bold text-brand-accent">{action}</span> : null}
                </>
              );
              return (
                <li key={`${a.kind}-${a.at}-${i}`}>
                  {url ? <a href={url} target="_blank" rel="noopener" className="flex items-center gap-3 py-2.5">{body}</a>
                    : <div className="flex items-center gap-3 py-2.5">{body}</div>}
                </li>
              );
            })}
          </ul>
        )}
        {d.activity.length > 6 ? <button className="mt-1 text-sm font-semibold text-brand" onClick={() => setAll(!all)}>{all ? 'Show less' : 'Show more'}</button> : null}
        <Replies me={me} keys={[me.children.length ? 'reports' : null, 'subscription', 'schedule']} onGo={onGo} />
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- page */
const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const POP_KEY = 'qp.quizpop.later';
const popLater = () => { try { return localStorage.getItem(POP_KEY) === todayIST(); } catch { return false; } };
const setPopLater = () => { try { localStorage.setItem(POP_KEY, todayIST()); } catch { /* private mode */ } };
const VIEWS = ['profile', 'subscription', 'schedule', 'reports', 'plans', 'notifications', 'trial', 'signout_all', 'deactivate'];
const TITLES = {
  profile: '👤 My profile', subscription: '📄 My subscription', schedule: '📅 Quiz schedule', reports: '📊 My reports',
  notifications: '🔔 Notifications', signout_all: '📵 Sign out from all devices', deactivate: '🗑️ Deactivate account',
};

export default function ParentApp() {
  const [signedIn, setSignedIn] = useState(Boolean(appToken.get()));
  const [me, setMe] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState(null);
  const [note, setNote] = useState('');            // on the sign-in screen: signed out everywhere, deactivated
  // Offered on its own after sign-in (unless installed or put off); the menu brings it back.
  const [showInstall, setShowInstall] = useState(() => install.shouldOffer());
  // The menu (2026-10-10): which answer is open, the menu sheet, the quiz pop-up.
  const [view, setView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizPop, setQuizPop] = useState(false);
  const linkDone = useRef(false);
  useEffect(() => install.onChange(() => { if (install.shouldOffer()) setShowInstall(true); }), []);

  const load = useCallback(() => {
    setErr('');
    app.me().then(setMe).catch((x) => { if (x.signIn) { setSignedIn(false); setMe(null); } else setErr(x.message); });
  }, []);
  useEffect(() => { if (signedIn) load(); }, [signedIn, load]);
  // Back from the quiz, the trial form or the checkout: show the fresh state.
  useEffect(() => {
    const onShow = () => { if (appToken.get()) load(); };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, [load]);
  // Kept fresh while open — every 3 minutes and on coming back to it — so the quiz
  // pop-up appears when the quiz window opens with the app on screen.
  useEffect(() => {
    if (!signedIn) return undefined;
    const tick = () => { if (document.visibilityState === 'visible' && appToken.get()) load(); };
    const t = setInterval(tick, 180000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', tick); };
  }, [signedIn, load]);

  // The quiz pop-up: from a phone notification (?open=quiz), or by itself when a quiz is ready
  // (not again today after "Later"). A notification's other links open their answer.
  useEffect(() => {
    if (!me) return;
    if (!linkDone.current) {
      linkDone.current = true;
      const open = new URLSearchParams(window.location.search).get('open');
      if (open) {
        window.history.replaceState(null, '', window.location.pathname);
        if (open === 'quiz') { setQuizPop(true); return; }
        if (VIEWS.includes(open)) { setView(open); return; }
      }
    }
    if (!me.needs_email && readyKids(me).length && !popLater()) setQuizPop(true);
  }, [me]);

  const toSignIn = (text) => { appToken.set(''); setMe(null); setView('home'); setMsg(null); setQuizPop(false); setNote(text || ''); setSignedIn(false); };
  const signOut = async () => { await app.signOut(); toSignIn('You are signed out on this device.'); };

  if (!signedIn) {
    return (
      <Shell>
        <SignIn note={note} onDone={(r) => {
          setNote(''); setView('home'); linkDone.current = false;
          if (r?.reactivated) setMsg({ tone: 'good', text: '👋 Welcome back! Your QuizPe account is active again — quizzes and reminders are back on.' });
          setSignedIn(true);
        }} />
      </Shell>
    );
  }
  if (err) return <Shell onSignOut={signOut}><Note tone="error">{err} <button className="underline font-semibold" onClick={load}>Try again</button></Note></Shell>;
  if (!me) return <Shell><div className="card p-6 text-sm text-muted">Loading your QuizPe…</div></Shell>;

  const first = String(me.parent?.name || '').trim().split(/\s+/)[0];
  const hasKids = me.children.length > 0;
  const plan = me.plan;
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* A tap on the menu or on a reply: answer it, the way the bot did. */
  const go = async (k) => {
    setMsg(null);
    if (k === 'home') { setView('home'); top(); return; }
    if (k === 'menu') { setMenuOpen(true); return; }
    if (k === 'quiz') { setQuizPop(true); return; }
    if (k === 'install') { setView('home'); setShowInstall(true); top(); return; }
    if (k === 'signout') { await signOut(); return; }
    if (k === 'support') {
      try { const r = await app.supportLink(); window.location.href = r.url; }
      catch (x) { setMsg({ tone: 'error', text: `${x.message} You can also write to ${SUPPORT_EMAIL}.` }); }
      return;
    }
    if (k === 'comeback') {
      try {
        const r = await app.comeback();
        setView('home'); top();
        setMsg({ tone: 'good', text: `🎉 Welcome back! QuizPe is on for ${r.days} free days, till ${fmtDate(r.ends)}. Today's quiz is ready whenever your child is.`, replies: ['quiz', 'schedule'] });
        try { localStorage.removeItem(POP_KEY); } catch { /* private mode */ }
        load();
      } catch (x) { setMsg({ tone: 'error', text: x.message, replies: ['plans'] }); }
      return;
    }
    if (k === 'resume') {
      try {
        await app.resume();
        setMsg({ tone: 'good', text: '▶️ QuizPe is back on — quizzes and reminders will reach you again.', replies: ['quiz', 'schedule'] });
        load();
      } catch (x) { setMsg({ tone: 'error', text: x.message }); }
      return;
    }
    if (VIEWS.includes(k)) { setView(k); top(); }
  };

  const sub = me.subscribed;
  const quiz = sub && hasKids ? 'quiz' : null;
  const REPLIES = {
    profile: ['subscription', 'notifications', hasKids ? 'reports' : null],
    subscription: sub ? [quiz, 'plans', 'reports'] : ['plans', me.can_start_trial ? 'trial' : null, 'support'],
    schedule: sub ? [quiz, 'notifications', 'subscription'] : ['plans', 'subscription'],
    reports: sub ? [quiz, 'schedule', 'subscription'] : ['plans', 'subscription'],
    plans: ['subscription', 'support'],
    notifications: ['profile', 'schedule'],
    trial: ['plans', 'support'],
    signout_all: ['profile'],
    deactivate: ['notifications', 'support'],
  };
  const answer = {
    profile: () => <Profile me={me} onSaved={load} onMessage={setMsg} />,
    subscription: () => <Subscriptions />,
    schedule: () => <InfoCard what="schedule" />,
    reports: () => <Reports />,
    plans: () => <Plans me={me} onMessage={setMsg}
                        title={me.status === 'EXPIRED' ? '🔄 Renew your plan' : plan?.trial ? '💎 Keep going after the trial' : sub ? '💎 Renew early or change plan' : '💎 Choose a plan'} />,
    notifications: () => <Reminders me={me} onGo={go} />,
    trial: () => (me.can_start_trial ? <StartTrial me={me} onMessage={setMsg} /> : <Note>The free trial has already been used on this number — choose a plan to continue.</Note>),
    signout_all: () => <SignOutAll onMessage={setMsg} onDone={(n) => toSignIn(`📵 Signed out on every device${n > 1 ? ` (${n})` : ''}. Sign in again any time with an SMS code.`)} />,
    deactivate: () => <Deactivate me={me} onMessage={setMsg} onGo={go}
                                  onDone={() => toSignIn('Your QuizPe account is deactivated. Quizzes, reminders and messages have stopped, and every device is signed out. Changed your mind? Sign in again with this number and everything comes back.')} />,
  };
  const names = me.children.map((c) => c.name.split(/\s+/)[0]);
  const shownMsg = msg ? (
    <div>
      <Note tone={msg.tone}>{msg.text}</Note>
      {/* Inside an answer its own replies follow, so a note's replies show only on the dashboard. */}
      {msg.replies && view === 'home' ? <Replies me={me} keys={[...msg.replies, 'menu']} onGo={go} /> : null}
    </div>
  ) : null;

  return (
    <Shell onSignOut={signOut} mobile={me.mobile} who={names.length ? names.join(' & ') : ''} onMenu={() => setMenuOpen(true)}
           onInstall={() => { setView('home'); setShowInstall(true); top(); }}>
      {view !== 'home' && answer[view] ? (
        <Panel me={me} title={TITLES[view]} replies={REPLIES[view]} onGo={go} test={`view-${view}`}>
          {shownMsg}
          {answer[view]()}
        </Panel>
      ) : (<>
        <div>
          <h1 className="text-2xl font-extrabold text-brand">{first ? `Hi ${first} 👋` : 'Welcome 👋'}</h1>
          {hasKids ? <p className="text-sm text-muted mt-0.5">{names.join(' & ')}’s QuizPe</p> : null}
          {/* In the welcome too (user, 2026-10-10), with the hanging notice: WhatsApp is gone. */}
          <p className="text-xs text-muted mt-1.5" data-test="web-note">📢 <i>{WEB_NOTE}</i></p>
        </div>
        {shownMsg}
        {showInstall ? <InstallCard onClose={() => setShowInstall(false)} /> : null}

        {me.needs_email ? <EmailGate me={me} onSaved={() => { setMsg({ tone: 'good', text: 'Thank you — reminders and reports will reach you there.' }); load(); }} /> : (<>
          {/* Where QuizPe stands right now (2026-10-10). */}
          <StatusCard me={me} onGo={go} />
          {hasKids ? <div className="space-y-4">{me.children.map((c) => <ChildCard key={c.id} child={c} me={me} onMessage={setMsg} />)}</div> : null}
          {/* The menu lives in the header (☰ Menu); the dashboard shows the week and what happened lately. */}
          <Activity me={me} onGo={go} />
        </>)}
      </>)}
      {menuOpen ? <MenuSheet me={me} onGo={go} onClose={() => setMenuOpen(false)} /> : null}
      {quizPop ? <QuizPopup me={me} onGo={go} onMessage={(m) => { setView('home'); setMsg(m); }} onClose={() => { setPopLater(); setQuizPop(false); }} /> : null}
    </Shell>
  );
}
