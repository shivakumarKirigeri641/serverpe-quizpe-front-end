/**
 * Contact form. Validated field by field, and on success we show the reference
 * number so a parent has something concrete to quote back at us.
 */

import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { api, safe } from '../lib/api';
import { SUPPORT_EMAIL, WA_LINK, WHATSAPP_DISPLAY } from '../content';

const EMPTY = { user_name: '', mobile_number: '', email: '', query_type: '', message: '' };

export default function Contact() {
  const [types, setTypes] = useState([]);
  const [f, setF] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [state, setState] = useState({ busy: false, error: '', ref: '' });

  useEffect(() => { safe(api.queryTypes()).then((d) => setTypes(d?.rows || [])); }, []);

  const errors = {
    user_name: f.user_name.trim().length < 2 ? 'Please tell us your name' : '',
    mobile_number: !/^[6-9]\d{9}$/.test(f.mobile_number) ? 'Enter a valid 10-digit mobile number' : '',
    email: f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(f.email) ? 'That email does not look right' : '',
    query_type: !f.query_type ? 'Please choose a topic' : '',
    message: f.message.trim().length < 10 ? 'Please add a little more detail' : '',
  };
  const valid = !Object.values(errors).some(Boolean);
  const show = (k) => (touched[k] || state.error) && errors[k];

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ user_name: 1, mobile_number: 1, email: 1, query_type: 1, message: 1 });
    if (!valid || state.busy) return;
    setState({ busy: true, error: '', ref: '' });
    try {
      const r = await api.sendEnquiry(f);
      setF(EMPTY);
      setTouched({});
      setState({ busy: false, error: '', ref: r.ref_no });
    } catch (err) {
      setState({ busy: false, error: err.message, ref: '' });
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container-x grid lg:grid-cols-[.85fr,1.15fr] gap-10 items-start">
        <Reveal>
          <span className="eyebrow">Contact</span>
          <h2 className="h2 mt-4">Ask us anything</h2>
          <p className="lede mt-3">
            Whether it is a board we do not cover yet, a question about pricing, or a school enquiry —
            write to us and you will hear back within 24 hours.
          </p>

          <div className="card p-6 mt-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Fastest way</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                 className="font-bold text-brand hover:text-brand-accent">
                💬 WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Email</p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand hover:text-brand-accent">
                {SUPPORT_EMAIL}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Response time</p>
              <p className="text-sm text-muted">Within 24 hours, every day</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="card p-7" noValidate>
            {state.ref ? (
              <div className="text-center py-8">
                <div className="text-5xl" aria-hidden>✅</div>
                <h3 className="font-extrabold text-brand text-xl mt-3">Message received</h3>
                <p className="text-muted text-sm mt-2">Your reference number is</p>
                <p className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-accent/10 text-brand font-black text-lg tracking-wide">
                  {state.ref}
                </p>
                <p className="text-muted text-sm mt-3">We will reply within 24 hours.</p>
                <button type="button" className="btn-ghost mt-5 !py-2.5 !text-sm"
                        onClick={() => setState({ busy: false, error: '', ref: '' })}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-extrabold text-brand text-lg mb-5">Send us a message</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="c-name">Your name *</label>
                    <input id="c-name" className="input" value={f.user_name} maxLength={120}
                           onBlur={() => setTouched({ ...touched, user_name: 1 })}
                           onChange={(e) => setF({ ...f, user_name: e.target.value })} />
                    {show('user_name') && <p className="text-xs text-red-600 mt-1">{errors.user_name}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-mob">Mobile number *</label>
                    <input id="c-mob" className="input" inputMode="numeric" maxLength={10}
                           value={f.mobile_number} placeholder="10-digit number"
                           onBlur={() => setTouched({ ...touched, mobile_number: 1 })}
                           onChange={(e) => setF({ ...f, mobile_number: e.target.value.replace(/\D/g, '') })} />
                    {show('mobile_number') && <p className="text-xs text-red-600 mt-1">{errors.mobile_number}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label" htmlFor="c-email">Email (optional)</label>
                  <input id="c-email" className="input" type="email" value={f.email} maxLength={160}
                         onBlur={() => setTouched({ ...touched, email: 1 })}
                         onChange={(e) => setF({ ...f, email: e.target.value })} />
                  {show('email') && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div className="mt-4">
                  <label className="label" htmlFor="c-type">What is it about? *</label>
                  <select id="c-type" className="input" value={f.query_type}
                          onBlur={() => setTouched({ ...touched, query_type: 1 })}
                          onChange={(e) => setF({ ...f, query_type: e.target.value })}>
                    <option value="">Choose a topic</option>
                    {types.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
                  </select>
                  {show('query_type') && <p className="text-xs text-red-600 mt-1">{errors.query_type}</p>}
                </div>

                <div className="mt-4">
                  <label className="label" htmlFor="c-msg">Your message *</label>
                  <textarea id="c-msg" className="input min-h-[120px]" value={f.message} maxLength={2000}
                            onBlur={() => setTouched({ ...touched, message: 1 })}
                            onChange={(e) => setF({ ...f, message: e.target.value })} />
                  <div className="text-right text-[11px] text-muted mt-1">{f.message.length}/2000</div>
                  {show('message') && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                </div>

                {state.error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
                    {state.error}
                  </p>
                )}

                <button className="btn-wa mt-5 w-full" disabled={state.busy}>
                  {state.busy ? 'Sending…' : 'Send message'}
                </button>
                <p className="text-[11px] text-muted mt-3 text-center">
                  We use your number only to reply. See the Privacy Policy in the footer.
                </p>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
