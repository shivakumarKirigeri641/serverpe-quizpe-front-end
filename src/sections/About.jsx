import Reveal from '../components/Reveal.jsx';
import { ABOUT, SUPPORT_EMAIL } from '../content';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white border-y border-line">
      <div className="container-x grid lg:grid-cols-[.9fr,1.1fr] gap-12 items-start">
        <Reveal>
          <span className="eyebrow">The story</span>
          <h2 className="h2 mt-4">Built by a parent, at his own dinner table.</h2>
          <div className="card p-6 mt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand text-white grid place-items-center text-xl font-black">
                SK
              </div>
              <div>
                <p className="font-extrabold text-brand">{ABOUT.name}</p>
                <p className="text-xs text-muted">{ABOUT.role}</p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[['14+', 'years in IT'], ['1', 'parent, like you'], ['365', 'quizzes a year']].map(([n, l]) => (
                <div key={l} className="rounded-xl bg-cream p-3">
                  <dt className="text-xl font-black text-brand">{n}</dt>
                  <dd className="text-[10px] font-bold uppercase tracking-wide text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? 'text-lg font-semibold text-brand' : 'text-muted'}`}>
                {p}
              </p>
            ))}
          </div>

          <div className="card p-6 mt-7 border-brand-accent/30 bg-brand-accent/[0.04]">
            <h3 className="font-extrabold text-brand">A request</h3>
            <p className="text-[15px] text-muted mt-2 leading-relaxed">{ABOUT.ask}</p>
            <a href="#contact" className="btn-ghost mt-4 !py-2.5 !text-sm">Tell me what to build next</a>
          </div>

          <p className="text-xs text-muted mt-4">
            Questions or suggestions: <a className="font-bold text-brand" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
