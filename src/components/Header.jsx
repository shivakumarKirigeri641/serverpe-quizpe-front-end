/** Sticky header. The WhatsApp button follows you down the page — it is the
 *  only action that matters, so it is never more than one tap away. */
import { useEffect, useState } from 'react';
import { WA_LINK } from '../content';

const LINKS = [
  ['How it works', '#how-it-works'],
  ['See a sample', '#preview'],
  ['Why QuizPe', '#why'],
  ['Coverage', '#coverage'],
  ['Pricing', '#pricing'],
  ['Reviews', '#testimonials'],
  ['FAQ', '#faq'],
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition ${solid ? 'bg-white/90 backdrop-blur border-b border-line' : 'bg-transparent'}`}>
      <div className="container-x flex items-center gap-3 h-16">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <img src="/assets/logo-mark.png" alt="QuizPe" className="w-9 h-9 rounded-xl" />
          <span className="font-extrabold text-brand text-lg">QuizPe</span>
        </a>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}
               className="px-3 py-2 text-sm font-semibold text-muted hover:text-brand rounded-lg transition">
              {label}
            </a>
          ))}
        </nav>

        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
           className="btn-wa ml-auto !px-5 !py-2.5 !text-sm">
          <span aria-hidden>💬</span> Start on WhatsApp
        </a>

        <button className="lg:hidden p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="block w-5 h-0.5 bg-brand mb-1" />
          <span className="block w-5 h-0.5 bg-brand mb-1" />
          <span className="block w-5 h-0.5 bg-brand" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-white">
          <div className="container-x py-2 grid">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}
                 className="py-2.5 text-sm font-semibold text-muted">{label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
