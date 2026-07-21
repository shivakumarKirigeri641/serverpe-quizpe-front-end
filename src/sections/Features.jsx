import Reveal from '../components/Reveal.jsx';
import { FEATURES, PARENT_NOTE, WHY_EVENING } from '../content';

export default function Features() {
  return (
    <section id="why" className="py-20">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Why QuizPe</span>
          <h2 className="h2 mt-4">Built to be finished, not just downloaded.</h2>
          <p className="lede mt-3">
            Most learning apps are opened once and forgotten. QuizPe is ten minutes a night that a child
            will actually do — and that you can see the result of, every single day.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <article className="card h-full p-6 hover:shadow-lift transition-shadow">
                <div className="text-3xl" aria-hidden>{f.icon}</div>
                <h3 className="font-extrabold text-brand mt-3">{f.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="card p-7 border-brand-accent/30 bg-brand-accent/[0.04] h-full">
              <h3 className="font-extrabold text-brand text-lg">🤝 {PARENT_NOTE.title}</h3>
              <p className="text-[15px] text-muted mt-2 leading-relaxed">{PARENT_NOTE.body}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card p-7 h-full">
              <h3 className="font-extrabold text-brand text-lg">🌙 {WHY_EVENING.title}</h3>
              <p className="text-[15px] text-muted mt-2 leading-relaxed">{WHY_EVENING.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
