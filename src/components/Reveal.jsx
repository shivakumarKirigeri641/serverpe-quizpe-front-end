/** Fades a block in the first time it scrolls into view. One shared component
 *  so the whole page animates consistently and honours reduced-motion. */
import { motion } from 'framer-motion';

export default function Reveal({ children, delay = 0, y = 18, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.9, 0.28, 1] }}
    >{children}</motion.div>
  );
}
