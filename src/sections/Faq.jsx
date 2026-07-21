/** FAQ as real <details> elements — they work without JavaScript, are
 *  keyboard accessible, and Google can read them for rich results. */
import Reveal from '../components/Reveal.jsx';
import { Helmet } from 'react-helmet-async';
import { FAQ } from '../content';

export default function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section id="faq" className="py-20">
      <Helmet><script type="application/ld+json">{JSON.stringify(jsonLd)}</script></Helmet>
      <div className="container-x max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">Questions</span>
          <h2 className="h2 mt-4">The things parents ask first</h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i * 0.04, 0.3)}>
              <details className="card p-5 group">
                <summary className="font-bold text-brand cursor-pointer list-none flex items-center gap-3">
                  <span className="text-brand-accent transition-transform group-open:rotate-90" aria-hidden>▸</span>
                  {f.q}
                </summary>
                <p className="text-[15px] text-muted mt-3 pl-6 leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
