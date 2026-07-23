/**
 * The founding-families bar that sits above the header.
 *
 * Scarcity only works if it is true, so the seat count is read live from the
 * API and the whole bar removes itself the moment the seats are gone. A banner
 * that still says "only 3 left!" a week after the offer closed does more damage
 * than never having run one.
 *
 * It is also dismissible. A parent who has read it once and is still deciding
 * should not have it shoved at them on every visit.
 */

import { useEffect, useState } from 'react';
import { api, safe } from '../lib/api';

const DISMISS_KEY = 'quizpe.launch.dismissed';

export default function LaunchBanner() {
  const [o, setO] = useState(null);
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => { safe(api.launchOffer()).then(setO); }, []);

  // No data, offer over, or dismissed for this visit — render nothing at all.
  if (!o || !o.active || hidden) return null;

  const urgent = o.remaining <= 10;
  const dismiss = () => {
    setHidden(true);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* private mode */ }
  };

  return (
    <div className={`relative text-white ${urgent ? 'bg-rose-600' : 'bg-brand'}`}>
      <div className="container-x py-2.5 pr-9 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-center">
        <span className="text-[11px] font-extrabold uppercase tracking-wider
                         bg-white/20 rounded-full px-2.5 py-0.5">
          {o.label}
        </span>
        <p className="text-sm font-semibold">
          First {o.cap} students get launch pricing —{' '}
          <b className="underline underline-offset-2">
            {o.remaining} seat{o.remaining === 1 ? '' : 's'} left
          </b>
          <span className="hidden sm:inline"> · prices rise after that</span>
        </p>
        <a href="#pricing" className="text-xs font-extrabold bg-white text-brand
                                      rounded-full px-3 py-1 hover:bg-cream transition">
          See plans
        </a>
      </div>
      <button onClick={dismiss} aria-label="Dismiss offer banner"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center
                         rounded-full text-white/70 hover:text-white hover:bg-white/15 transition">
        ✕
      </button>
    </div>
  );
}
