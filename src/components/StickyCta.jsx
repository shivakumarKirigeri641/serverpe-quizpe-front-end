/** A persistent call to action on phones once the hero has scrolled away.
 *  Most visitors arrive on a phone, and by mid-page the header button is out
 *  of thumb reach — this keeps the one action always available. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WA_LINK } from '../content';

export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur border-t border-line"
        >
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa w-full">
            💬 Say “hi” — start free
          </a>
          <p className="text-[10px] text-muted text-center mt-1.5">
            No app · no login · no card
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
