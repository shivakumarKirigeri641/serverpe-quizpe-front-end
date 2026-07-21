/** What we can genuinely deliver, read from the API. Nothing is advertised
 *  that the question bank cannot actually serve. */
import Reveal from '../components/Reveal.jsx';
import { COMING_SOON } from '../content';

export default function Coverage({ coverage }) {
  const combos = coverage?.combinations || [];
  const byBoard = combos.reduce((a, c) => ((a[c.board] ||= []).push(c), a), {});

  return (
    <section id="coverage" className="py-20 bg-white border-y border-line">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Coverage</span>
          <h2 className="h2 mt-4">Available right now</h2>
          <p className="lede mt-3">
            We list a board and grade only once the questions genuinely exist for it. If yours is not here
            yet, tell us — what parents ask for is what gets built next.
          </p>
        </Reveal>

        {combos.length ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(byBoard).map(([board, list], i) => (
              <Reveal key={board} delay={i * 0.07}>
                <div className="card p-6 h-full">
                  <h3 className="font-extrabold text-brand text-lg">{board}</h3>
                  <ul className="mt-3 space-y-2">
                    {list.map((c) => (
                      <li key={c.grade} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" aria-hidden />
                        <span className="font-semibold">{c.grade_name}</span>
                        <span className="text-muted text-xs ml-auto">{c.mediums.join(', ')}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 pt-3 border-t border-line text-xs text-muted">Mathematics · more subjects coming</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted mt-10">Loading available boards and grades…</p>
        )}

        <Reveal delay={0.2} className="mt-10">
          <h3 className="text-center font-extrabold text-brand">Coming next</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMING_SOON.map((c) => (
              <div key={c.title} className="rounded-2xl border-2 border-dashed border-line p-5 text-center">
                <div className="text-2xl" aria-hidden>{c.icon}</div>
                <h4 className="font-bold text-brand mt-2 text-sm">{c.title}</h4>
                <p className="text-xs text-muted mt-1">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
