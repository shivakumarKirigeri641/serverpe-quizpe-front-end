/**
 * "See it before you say hi."
 *
 * The single biggest reason a parent hesitates is not price — it is not
 * knowing what actually arrives. This section shows the three artefacts:
 * the WhatsApp message, a real question, and the report card. Nothing is
 * promised here that the product does not send.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal.jsx';
import { WA_LINK } from '../content';

const SAMPLE_Q = {
  chapter: 'Numbers up to 999',
  text: '9 hundreds + 7 tens + 1 one = ?',
  options: [{ k: 'A', t: '970' }, { k: 'B', t: '971' }, { k: 'C', t: '917' }, { k: 'D', t: '791' }],
  answer: 'B',
  why: '9 hundreds is 900, 7 tens is 70, and 1 one is 1. Add them: 900 + 70 + 1 = 971.',
};

const TABS = [
  { k: 'chat', label: '1. It arrives on WhatsApp' },
  { k: 'quiz', label: '2. Ten questions' },
  { k: 'report', label: '3. The report, straight away' },
];

export default function Preview() {
  const [tab, setTab] = useState('chat');
  const [picked, setPicked] = useState(null);

  return (
    <section id="preview" className="py-20 bg-white border-y border-line">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">See it first</span>
          <h2 className="h2 mt-4">Exactly what lands on your phone</h2>
          <p className="lede mt-3">
            No mock-ups. This is the real message, a real question and the real report card.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mt-9">
            {TABS.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition border-2
                  ${tab === t.k ? 'bg-brand text-white border-brand' : 'bg-white text-muted border-line hover:border-brand-accent'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}>

              {tab === 'chat' && (
                <div className="rounded-3xl bg-[#e5ddd5] p-5 shadow-soft">
                  <div className="bg-brand text-white rounded-t-2xl px-4 py-3 -mx-5 -mt-5 mb-4 flex items-center gap-3">
                    <img src="/assets/logo-mark.png" alt="" className="w-9 h-9 rounded-lg bg-white p-1" />
                    <div>
                      <p className="font-bold text-sm">QuizPe</p>
                      <p className="text-[11px] text-white/70">online</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl rounded-tl-md p-3.5 max-w-[85%] shadow-sm text-sm">
                    <p className="font-bold text-brand mb-1">Shivam's quiz</p>
                    <p className="text-ink">📚 <b>Mathematics</b><br />
                      <span className="text-muted">10 questions, about 5 minutes.</span></p>
                    <p className="text-ink mt-2">Tap below to begin — the score and report come straight back here.</p>
                    <div className="mt-3 -mx-3.5 -mb-3.5 border-t border-line py-2.5 text-center
                                    text-[#00a5f4] font-semibold text-sm">▶️ Start quiz</div>
                  </div>
                  <p className="text-[11px] text-muted mt-3 text-center">
                    One reminder an hour before. Never more.
                  </p>
                </div>
              )}

              {tab === 'quiz' && (
                <div className="card p-6">
                  <div className="flex justify-between text-xs text-muted mb-2">
                    <span>Question <b className="text-brand">1</b> of <b className="text-brand">10</b></span>
                    <span>9 left</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden mb-4">
                    <div className="h-full w-[10%] bg-brand-accent rounded-full" />
                  </div>

                  <p className="text-[11px] text-muted">{SAMPLE_Q.chapter}</p>
                  <p className="text-xl font-bold mt-1 mb-4">{SAMPLE_Q.text}</p>

                  <div className="grid gap-2">
                    {SAMPLE_Q.options.map((o) => {
                      const isPicked = picked === o.k;
                      const isRight = o.k === SAMPLE_Q.answer;
                      const show = picked !== null;
                      return (
                        <button key={o.k} onClick={() => setPicked(o.k)}
                          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition
                            ${show && isRight ? 'border-emerald-400 bg-emerald-50'
                              : show && isPicked ? 'border-red-400 bg-red-50'
                              : 'border-line hover:border-brand-accent'}`}>
                          <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-extrabold
                            ${show && isRight ? 'bg-emerald-500 text-white'
                              : show && isPicked ? 'bg-red-500 text-white' : 'bg-cream text-brand'}`}>{o.k}</span>
                          <span className="font-semibold">{o.t}</span>
                          {show && isRight && <span className="ml-auto text-xs font-bold text-emerald-700">correct</span>}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {picked && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                  className="overflow-hidden">
                        <div className="mt-4 rounded-xl bg-brand-accent/10 p-4 text-sm">
                          <p className="font-bold text-brand">💡 Why</p>
                          <p className="text-muted mt-1">{SAMPLE_Q.why}</p>
                          <p className="text-[11px] text-muted mt-2">
                            Your child sees this in the report afterwards — never during the quiz, so the
                            score stays honest.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!picked && <p className="text-xs text-muted mt-4 text-center">Try it — tap an answer.</p>}
                </div>
              )}

              {tab === 'report' && (
                <div className="card p-6">
                  <div className="bg-brand text-white -mx-6 -mt-6 px-6 py-4 rounded-t-3xl mb-5">
                    <p className="font-extrabold">QuizPe — Daily Report</p>
                    <p className="text-xs text-white/70">Shivam · CBSE Grade 2 · Mathematics · 21 Jul 2026</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[['Score', '8/10'], ['Accuracy', '80%'], ['Grade', 'A'], ['Time', '4m 12s']].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-cream p-3">
                        <p className="text-lg font-black text-brand">{v}</p>
                        <p className="text-[10px] font-bold uppercase text-muted">{l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-extrabold uppercase text-emerald-800">Since last quiz</p>
                    <p className="text-sm text-emerald-900 mt-1">
                      <b>+20 percentage points.</b> Shivam improved from 60% to 80%, and answered
                      6 seconds faster per question.
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-extrabold uppercase text-muted mb-2">Chapter breakdown</p>
                    {[['Numbers up to 999', 4, 4], ['Addition with Regrouping', 3, 4], ['Multiplication Tables', 1, 2]]
                      .map(([c, got, of]) => (
                      <div key={c} className="flex items-center gap-3 py-1.5 text-sm">
                        <span className="flex-1 truncate">{c}</span>
                        <div className="w-24 h-1.5 rounded-full bg-line overflow-hidden">
                          <div className="h-full bg-brand-accent" style={{ width: `${(got / of) * 100}%` }} />
                        </div>
                        <span className="font-bold w-10 text-right">{got}/{of}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-cream p-4 text-sm">
                    <p className="font-bold text-brand">Every question explained</p>
                    <p className="text-muted mt-1">
                      The full PDF lists all ten questions, what your child chose, the correct answer,
                      and a drawn explanation for number work — place-value blocks, number lines and
                      grouped objects, not just “the answer is 971”.
                    </p>
                  </div>

                  <p className="text-[11px] text-muted mt-4 text-center">
                    Delivered as a PDF to your WhatsApp within seconds of the last answer.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal delay={0.2} className="text-center mt-10">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <span aria-hidden>💬</span> Get this for my child
          </a>
          <p className="text-xs text-muted mt-3">Free trial · no card · one message to start</p>
        </Reveal>
      </div>
    </section>
  );
}
