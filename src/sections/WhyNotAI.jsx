/**
 * "Why not just ask an AI for questions?"
 *
 * Some parents are already doing exactly that, so pretending otherwise would be
 * silly. The honest answer is not that AI is bad — it is that a chat window
 * gives you a question, while the work that makes daily practice actually
 * function is everything around the question: knowing which chapter is next,
 * remembering what was got wrong, bringing it back three weeks later, and
 * arriving without being asked.
 *
 * The section is written to respect a parent who is doing this already, not to
 * scold them. Attacking a tool a parent likes is a good way to lose the parent.
 */

import { Fragment } from 'react';
import Reveal from '../components/Reveal.jsx';
import { WA_LINK } from '../content';

const ROWS = [
  {
    job: 'Getting ten questions',
    diy: 'Yes — a good prompt gets you ten questions in a minute.',
    us: 'Ten arrive every evening without anyone asking.',
    diyOk: true,
  },
  {
    job: 'Matching your exact textbook',
    diy: 'You have to name the board, grade, chapter and month yourself — every time.',
    us: 'Already matched to your board, grade and the month your school is actually in.',
  },
  {
    job: 'Knowing what to ask next',
    diy: 'A fresh chat remembers nothing. You decide the chapter, every day.',
    us: 'Tracks what your child has mastered and moves on by itself.',
  },
  {
    job: 'Bringing back the mistakes',
    diy: 'Yesterday’s wrong answer is gone unless you kept a note of it.',
    us: 'Wrong answers come back until they stick, and old chapters return on a revision cycle.',
  },
  {
    job: 'Marking and explaining',
    diy: 'You check the answers and judge whether the explanation is right.',
    us: 'Marked instantly, with a drawn explanation for every question in a PDF report.',
  },
  {
    job: 'Being sure the answer is correct',
    diy: 'Confidently wrong answers happen, and a child cannot spot one.',
    us: 'Every answer is computed and checked before it is ever sent.',
  },
  {
    job: 'Happening at all on a Tuesday',
    diy: 'Only when someone remembers to sit down and do it.',
    us: 'Arrives on its own, at your chosen time, including holidays.',
  },
];

export default function WhyNotAI() {
  return (
    <section id="why-not-ai" className="py-20 border-y border-line bg-white">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">A fair question</span>
          <h2 className="h2 mt-4">“Can’t I just ask an AI for questions?”</h2>
          <p className="lede mt-3">
            You can, and plenty of parents do. Here is the honest comparison — because the
            questions were never the hard part.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 max-w-3xl mx-auto overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[1.1fr_1.3fr_1.3fr] gap-px bg-line rounded-2xl overflow-hidden text-sm">
                <div className="bg-cream p-3 font-extrabold text-brand text-xs uppercase tracking-wide">
                  The job
                </div>
                <div className="bg-cream p-3 font-extrabold text-muted text-xs uppercase tracking-wide">
                  Prompting it yourself
                </div>
                <div className="bg-brand p-3 font-extrabold text-white text-xs uppercase tracking-wide">
                  QuizPe
                </div>

                {ROWS.map((r) => (
                  <Fragment key={r.job}>
                    <div className="bg-white p-3 font-bold text-brand">{r.job}</div>
                    <div className="bg-white p-3 text-muted leading-relaxed">
                      <span className="mr-1" aria-hidden>{r.diyOk ? '✅' : '⚠️'}</span>{r.diy}
                    </div>
                    <div className="bg-emerald-50/60 p-3 text-ink leading-relaxed">
                      <span className="mr-1" aria-hidden>✅</span>{r.us}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <p className="text-lg font-extrabold text-brand">
              A chat window gives you a question. QuizPe runs the habit.
            </p>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Ten questions is five minutes of work. Doing it every evening for a year, in the right
              order, remembering what your child got wrong last week — that is the part nobody keeps
              up manually. That is the part we do.
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6">
              <span aria-hidden>💬</span> Let it arrive on its own
            </a>
            <p className="text-xs text-muted mt-3">
              Free trial · no card · stop any time by replying STOP
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
