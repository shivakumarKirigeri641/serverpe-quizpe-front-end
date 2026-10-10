import { useEffect, useState } from 'react';

/*
 * The nail sits on the header's bottom edge, wherever that is (below the banners on the
 * home page, at the top of the parent app), following it as the page scrolls — so the
 * sign never covers the header's buttons.
 */
function useNailY(fallback) {
  const [y, setY] = useState(fallback);
  useEffect(() => {
    const place = () => {
      const h = document.querySelector('header');
      setY(h ? Math.max(0, Math.round(h.getBoundingClientRect().bottom) - 4) : fallback);
    };
    place();
    const late = [setTimeout(place, 400), setTimeout(place, 1500)];
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => { late.forEach(clearTimeout); window.removeEventListener('scroll', place); window.removeEventListener('resize', place); };
  }, [fallback]);
  return y;
}

/*
 * THE HANGING NOTICE (user, 2026-10-10: "a hanging label saying QuizPe is now serving on
 * the web, with browser notifications, mail and SMS alerts, because the WhatsApp account
 * was disabled"). A small sign hanging on two strings below the header — on the home page,
 * the parent app and the policy pages. It swings in, then sways; ✕ folds it to a "📢" tag
 * for 3 days, and a tap on the tag hangs it again. Shown for a month ("give for month"),
 * then it takes itself down.
 */
const KEY = 'qp.hang.folded';
const DAYS = 3;
const UNTIL = new Date('2026-11-10T23:59:59+05:30');

const foldedNow = () => {
  try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < DAYS * 864e5; } catch { return false; }
};

// top: where the nail goes when the page has no header.
export default function HangingNotice({ top = 52 }) {
  const [folded, setFolded] = useState(foldedNow);
  const nailY = useNailY(top);
  const fold = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* private mode */ } setFolded(true); };
  const unfold = () => { try { localStorage.removeItem(KEY); } catch { /* private mode */ } setFolded(false); };
  if (Date.now() > UNTIL.getTime()) return null;
  return (
    <div className="pointer-events-none fixed right-3 z-40" style={{ top: `${nailY}px` }} data-test="hanging-notice">
      <div className={`hang-sign pointer-events-auto relative pt-4 ${folded ? 'hang-sway' : 'hang-swing'}`} key={folded ? 'tag' : 'sign'}>
        {/* the strings and the nail */}
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand" />
        <span aria-hidden="true" className="absolute top-0.5 h-[1.15rem] w-px origin-top bg-brand/60" style={{ left: '50%', transform: 'rotate(38deg)' }} />
        <span aria-hidden="true" className="absolute top-0.5 h-[1.15rem] w-px origin-top bg-brand/60" style={{ left: '50%', transform: 'rotate(-38deg)' }} />
        {folded ? (
          <button type="button" onClick={unfold} data-test="hanging-open"
            className="rounded-full border-2 border-brand bg-amber-300 px-3 py-1 text-[12px] font-black text-brand shadow-md">
            📢 Notice
          </button>
        ) : (
          <div role="status" className="w-[17.5rem] max-w-[calc(100vw-1.5rem)] rounded-2xl border-2 border-brand bg-amber-300 px-3.5 pb-3 pt-2.5 text-brand shadow-xl">
            <div className="flex items-start gap-2">
              <div className="text-[13.5px] font-black leading-snug">📢 QuizPe is now on the web</div>
              <button type="button" onClick={fold} aria-label="Fold the notice" data-test="hanging-fold"
                className="-mr-1 ml-auto shrink-0 rounded-full px-1.5 text-[15px] font-black leading-none text-brand/70 hover:text-brand">✕</button>
            </div>
            <p className="mt-1 text-[12.5px] font-semibold leading-snug">Our WhatsApp account was disabled, so QuizPe now serves you right here — quiz reminders and reports by browser notifications, email and SMS.</p>
          </div>
        )}
      </div>
    </div>
  );
}
