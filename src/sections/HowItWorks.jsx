import Reveal from '../components/Reveal.jsx';
import { HOW_IT_WORKS, WA_LINK } from '../content';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-line">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">How it works</span>
          <h2 className="h2 mt-4">Five steps. The first one is a single message.</h2>
          <p className="lede mt-3">
            There is no onboarding, no dashboard to learn and nothing to install. Here is the whole journey.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_IT_WORKS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.07}>
              <li className="card h-full p-6 relative">
                <span className="absolute -top-3 left-6 w-7 h-7 rounded-full bg-brand-accent text-white
                                 grid place-items-center text-xs font-extrabold">{s.step}</span>
                <div className="text-3xl mt-2" aria-hidden>{s.icon}</div>
                <h3 className="font-extrabold text-brand mt-3">{s.title}</h3>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.3} className="text-center mt-12">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <span aria-hidden>💬</span> Start now — it takes one message
          </a>
        </Reveal>
      </div>
    </section>
  );
}
