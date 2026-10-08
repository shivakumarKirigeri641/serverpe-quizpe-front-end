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
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { app, appToken } from '../lib/api';
import { SUPPORT_EMAIL } from '../content';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '');
const fmtTime = (hhmm) => {
  const [h, m] = String(hhmm || '').split(':').map(Number);
  if (Number.isNaN(h)) return '';
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

function Shell({ children, onSignOut, mobile }) {
  return (
    <div className="min-h-screen bg-cream">
      <Helmet><title>My QuizPe</title><meta name="robots" content="noindex" /></Helmet>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-2.5">
          <a href="/" className="flex items-center gap-2">
            <img src="/assets/logo-mark.png" alt="QuizPe" className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-brand">QuizPe</span>
          </a>
          {mobile ? (
            <>
              <span className="ml-auto text-xs text-muted tabular-nums">+91 {mobile.slice(0, 5)} {mobile.slice(5)}</span>
              <button onClick={onSignOut} className="text-xs font-bold text-brand border border-line rounded-full px-3 py-1.5">Sign out</button>
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

function Note({ tone = 'info', children }) {
  const cls = tone === 'error' ? 'bg-red-50 border-red-200 text-red-800'
    : tone === 'good' ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : 'bg-amber-50 border-amber-200 text-amber-900';
  return <div role="status" className={`rounded-2xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

/* ------------------------------------------------------------- sign in */
function SignIn({ onDone }) {
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
    try { const r = await app.verify(mobile, code.trim(), terms); appToken.set(r.token); onDone(); } catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-extrabold text-brand">Sign in to QuizPe</h1>
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
      onMessage({ tone: r.done ? 'good' : 'info', text: r.message });
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
          <div key={p.code} className={`rounded-2xl border px-4 py-3 ${picked === p.code ? 'border-brand-accent' : 'border-line'}`}>
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <div className="font-bold text-ink">{p.name}</div>
                <div className="text-xs text-muted">{p.children} child{p.children > 1 ? 'ren' : ''} · {p.days} days</div>
              </div>
              <div className="ml-auto text-right">
                {p.was > p.price ? <div className="text-[11px] text-muted line-through">{rupees(p.was)}</div> : null}
                <div className="font-extrabold text-brand">{rupees(p.price)}</div>
              </div>
              <button className="btn-wa !px-4 !py-2 !text-sm" disabled={Boolean(busy)} onClick={() => setPicked(picked === p.code ? '' : p.code)}>{picked === p.code ? 'Close' : 'Choose'}</button>
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
        <h2 className="font-extrabold text-brand text-lg">📊 Reports</h2>
        {!d.reports.length ? <p className="text-sm text-muted mt-1">The first report appears here the moment a quiz is finished.</p> : (
          <div className="mt-3 divide-y divide-line">
            {list.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener" className="flex items-center gap-3 py-2.5">
                <span className="w-16 shrink-0 text-center font-extrabold text-brand text-xs leading-tight">{r.grade || '—'}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink truncate">{r.child} · {r.subject || 'Quiz'}{r.type === 'weekly' ? ' · weekly' : ''}</span>
                  <span className="block text-xs text-muted">{fmtDate(r.date)} · {r.score} ({r.pct}%)</span>
                </span>
                <span className="ml-auto text-xs font-bold text-brand-accent">PDF ↗</span>
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
                <span className="text-xs font-bold text-brand-accent">PDF ↗</span>
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

function Reminders({ me, onSaved }) {
  const [push, setPush] = useState('unknown');   // unknown | on | off | denied | unsupported
  const [email, setEmail] = useState(me.parent?.email || '');
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
  const saveEmail = async (e) => {
    e.preventDefault(); setMsg(null);
    if (!EMAIL_RE.test(email.trim())) { setMsg({ tone: 'error', text: 'Please enter a valid email address — it is needed for reminders and reports.' }); return; }
    try { await app.profile({ email: email.trim() }); setMsg({ tone: 'good', text: 'Email saved.' }); onSaved(); } catch (x) { setMsg({ tone: 'error', text: x.message }); }
  };

  return (
    <div className="card p-5">
      <h2 className="font-extrabold text-brand text-lg">🔔 Reminders</h2>
      <p className="text-xs text-muted mt-0.5">One friendly nudge when today's quiz is ready, a note when a report is ready, and a reminder before the plan ends — nothing else.</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="text-sm min-w-0">
          <div className="font-semibold text-ink">Notifications on this phone</div>
          <div className="text-xs text-muted">{push === 'on' ? 'On' : push === 'denied' ? 'Blocked in your browser settings' : push === 'unsupported' ? 'Not supported here — on iPhone, add QuizPe to the Home Screen first' : 'Off'}</div>
        </div>
        {push === 'on' ? <button className="btn-ghost !px-4 !py-2 !text-sm ml-auto" disabled={busy} onClick={turnOff}>Turn off</button>
          : push === 'off' || push === 'unknown' ? <button className="btn-wa !px-4 !py-2 !text-sm ml-auto" disabled={busy} onClick={turnOn}>Turn on</button> : null}
      </div>
      {me.parent?.name !== undefined && me.status !== 'NEW' ? (
        <form onSubmit={saveEmail} className="mt-4">
          <label className="label" htmlFor="em">Email for reminders and reports *</label>
          <div className="flex gap-2">
            <input id="em" type="email" className="input" maxLength={120} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn-ghost !px-4 !py-2 !text-sm">Save</button>
          </div>
        </form>
      ) : null}
      {msg ? <div className="mt-3"><Note tone={msg.tone}>{msg.text}</Note></div> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- page */
export default function ParentApp() {
  const [signedIn, setSignedIn] = useState(Boolean(appToken.get()));
  const [me, setMe] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState(null);

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

  const signOut = async () => { await app.signOut(); appToken.set(''); setMe(null); setSignedIn(false); };

  if (!signedIn) return <Shell><SignIn onDone={() => setSignedIn(true)} /></Shell>;
  if (err) return <Shell onSignOut={signOut}><Note tone="error">{err} <button className="underline font-semibold" onClick={load}>Try again</button></Note></Shell>;
  if (!me) return <Shell><div className="card p-6 text-sm text-muted">Loading your QuizPe…</div></Shell>;

  const first = String(me.parent?.name || '').trim().split(/\s+/)[0];
  const hasKids = me.children.length > 0;
  const plan = me.plan;
  return (
    <Shell onSignOut={signOut} mobile={me.mobile}>
      <div>
        <h1 className="text-2xl font-extrabold text-brand">{first ? `Hi ${first} 👋` : 'Welcome 👋'}</h1>
        {plan && hasKids ? (
          <p className="text-sm text-muted mt-0.5">
            {me.status === 'EXPIRED' ? `Your ${plan.name} plan ended on ${fmtDate(plan.ends)}.`
              : `${plan.trial ? 'Free trial' : plan.name} · till ${fmtDate(plan.ends)}${plan.days_left != null && plan.days_left >= 0 ? ` · ${plan.days_left} day${plan.days_left === 1 ? '' : 's'} left` : ''}`}
          </p>
        ) : null}
      </div>
      {msg ? <Note tone={msg.tone}>{msg.text}</Note> : null}

      {me.needs_email ? <EmailGate me={me} onSaved={() => { setMsg({ tone: 'good', text: 'Thank you — reminders and reports will reach you there.' }); load(); }} /> : (<>
      {hasKids ? me.children.map((c) => <ChildCard key={c.id} child={c} me={me} onMessage={setMsg} />) : null}

      {me.can_start_trial ? <StartTrial me={me} onMessage={setMsg} /> : null}
      {!me.can_start_trial && (!me.subscribed || plan?.trial || (plan && plan.days_left != null && plan.days_left <= 7)) ? (
        <Plans me={me} onMessage={setMsg}
               title={me.status === 'EXPIRED' ? '🔄 Renew your plan' : plan?.trial ? '💎 Keep going after the trial' : me.subscribed ? '💎 Renew early' : '💎 Choose a plan'} />
      ) : null}

      {hasKids ? <Reports /> : null}
      <Reminders me={me} onSaved={load} />
      </>)}
    </Shell>
  );
}
