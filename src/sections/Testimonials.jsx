/** Approved testimonials from the API, plus a form to leave one.
 *  Submissions are held for moderation — the wall is never open to spam. */
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { api, safe } from '../lib/api';

const EMPTY = { user_name: '', author_role: 'Parent', location: '', rating: 0, message: '' };

export default function Testimonials() {
  const [rows, setRows] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [state, setState] = useState({ busy: false, error: '', done: '' });

  useEffect(() => { safe(api.testimonials()).then((d) => setRows(d?.rows || [])); }, []);

  const errors = {
    user_name: f.user_name.trim().length < 2 ? 'Please tell us your name' : '',
    rating: !f.rating ? 'Please choose a rating' : '',
    message: f.message.trim().length < 10 ? 'A sentence or two, please' : '',
  };
  const valid = !Object.values(errors).some(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || state.busy) return;
    setState({ busy: true, error: '', done: '' });
    try {
      const r = await api.sendFeedback({ ...f, rating: Number(f.rating) });
      setF(EMPTY);
      setState({ busy: false, error: '', done: r.message });
    } catch (err) {
      setState({ busy: false, error: err.message, done: '' });
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-white border-y border-line">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Reviews</span>
          <h2 className="h2 mt-4">What parents say</h2>
          <p className="lede mt-3">Every review here is from a real family using QuizPe.</p>
        </Reveal>

        {rows === null ? (
          <p className="text-center text-muted mt-10">Loading reviews…</p>
        ) : rows.length ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((t, i) => (
              <Reveal key={i} delay={(i % 3) * 0.07}>
                <figure className="card h-full p-6">
                  <div className="text-brand-accent text-lg" aria-label={`${t.rating} out of 5`}>
                    {'★'.repeat(t.rating || 5)}<span className="text-line">{'★'.repeat(5 - (t.rating || 5))}</span>
                  </div>
                  <blockquote className="text-[15px] text-ink mt-3 leading-relaxed">“{t.message}”</blockquote>
                  <figcaption className="mt-4 pt-3 border-t border-line text-sm">
                    <span className="font-bold text-brand">{t.author_name}</span>
                    <span className="text-muted">
                      {t.author_role ? ` · ${t.author_role}` : ''}{t.location ? ` · ${t.location}` : ''}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="card p-10 text-center mt-10 max-w-xl mx-auto">
              <div className="text-4xl" aria-hidden>🌱</div>
              <h3 className="font-extrabold text-brand mt-3">We are just getting started</h3>
              <p className="text-muted text-sm mt-2">
                QuizPe is new, so there are no published reviews yet. If your child has tried it,
                yours could be the first — and it will help another parent decide.
              </p>
            </div>
          </Reveal>
        )}

        {/* leave a review */}
        <Reveal delay={0.15}>
          <form onSubmit={submit} className="card p-7 mt-10 max-w-2xl mx-auto" noValidate>
            <h3 className="font-extrabold text-brand text-lg">Share your experience</h3>
            <p className="text-sm text-muted mt-1 mb-5">
              Reviews are read before publishing, so it may take a day to appear.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="t-name">Your name *</label>
                <input id="t-name" className="input" value={f.user_name} maxLength={120}
                       onChange={(e) => setF({ ...f, user_name: e.target.value })} />
                {state.error && errors.user_name && <p className="text-xs text-red-600 mt-1">{errors.user_name}</p>}
              </div>
              <div>
                <label className="label" htmlFor="t-role">You are a</label>
                <select id="t-role" className="input" value={f.author_role}
                        onChange={(e) => setF({ ...f, author_role: e.target.value })}>
                  <option>Parent</option><option>Guardian</option><option>Student</option><option>Teacher</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="t-loc">City (optional)</label>
                <input id="t-loc" className="input" value={f.location} maxLength={80}
                       placeholder="e.g. Bangalore"
                       onChange={(e) => setF({ ...f, location: e.target.value })} />
              </div>
            </div>

            <div className="mt-4">
              <span className="label">Your rating *</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" aria-label={`${n} star`}
                          onClick={() => setF({ ...f, rating: n })}
                          className={`text-3xl leading-none transition ${n <= f.rating ? 'opacity-100 scale-110' : 'opacity-30'}`}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="label" htmlFor="t-msg">Your review *</label>
              <textarea id="t-msg" className="input min-h-[110px]" value={f.message} maxLength={1000}
                        placeholder="What has QuizPe changed for your child?"
                        onChange={(e) => setF({ ...f, message: e.target.value })} />
              <div className="text-right text-[11px] text-muted mt-1">{f.message.length}/1000</div>
            </div>

            {state.error && <p className="text-sm text-red-600 mt-3">{state.error}</p>}
            {state.done && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-3">
                ✅ {state.done}
              </p>
            )}

            <button className="btn-wa mt-5 w-full" disabled={!valid || state.busy}>
              {state.busy ? 'Sending…' : 'Submit review'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
