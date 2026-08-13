/**
 * "Why QuizPe" — the four things a parent actually feels.
 *
 * Not a feature list; four real frustrations and how the product removes each:
 *   • the time you lose hunting for questions in Google / an AI
 *   • the daily fight to get a child to sit down
 *   • a quiz that meets the child where they are and grows with them
 *   • the exam-day panic of a "surprise" question
 *
 * The adaptive-difficulty card is given the most weight, because it is the one
 * thing a parent cannot recreate themselves with a search box.
 */

import Reveal from '../components/Reveal.jsx';
import { WA_LINK } from '../content';

const CARDS = [
  {
    icon: '⏱️',
    title: 'Stop hunting for questions',
    body: 'Why lose time searching Google or prompting an AI for the "right" questions? '
        + 'QuizPe already knows your child\'s board, grade and month — and delivers the right quiz, '
        + 'at the right time, every single day. From just ₹99.',
    tone: 'accent',
  },
  {
    icon: '🧲',
    title: 'Hard to sit them down?',
    body: 'No hour-long study battle. Just ten minutes with QuizPe quietly recalls '
        + 'everything your child learnt in school that day — as a game, not a chore.',
  },
  {
    icon: '📈',
    title: 'It grows with your child',
    body: 'This is what makes QuizPe different. It starts with gentle questions, and as your child '
        + 'answers well the difficulty rises — slowly, never all at once. That adaptive engine runs '
        + 'for every grade, so no child is ever bored or overwhelmed.',
    highlight: true,
  },
  {
    icon: '🛡️',
    title: 'No more surprise-question panic',
    body: 'A child who practises a little every day is never rattled by an unexpected question in an '
        + 'exam. QuizPe builds that calm, daily habit — so exam day feels like just another quiz.',
  },
];

export default function WhyQuizPe() {
  return (
    <section id="why-quizpe" className="py-20 bg-cream">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Why parents choose it</span>
          <h2 className="h2 mt-4">Less effort for you. More for your child.</h2>
          <p className="lede mt-3">
            The daily things that make studying hard — QuizPe is built to remove each one.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={0.05 + i * 0.05}>
              <div className={`card h-full p-6 flex gap-4 ${
                c.highlight ? 'border-2 border-brand-accent shadow-lift' : ''}`}>
                <span className="text-3xl leading-none shrink-0" aria-hidden>{c.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-brand text-lg">{c.title}</h3>
                    {c.highlight && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider
                                       bg-brand-accent text-white px-2 py-0.5 rounded-full">
                        Our algorithm
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-1.5 leading-relaxed">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} className="text-center mt-10">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <span aria-hidden>💬</span> Start free — takes one message
          </a>
          <p className="text-xs text-muted mt-3">No card · take the quiz any time today</p>
        </Reveal>
      </div>
    </section>
  );
}
