/** Live numbers from the API. Tiles with no data are hidden rather than shown
 *  as zero — an empty statistic is worse than no statistic. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { STAT_TILES } from '../content';

function Count({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const target = Number(to) || 0;
    if (target <= 0) return setN(0);
    const dur = 1100, t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));   // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{n.toLocaleString('en-IN')}{suffix}</span>;
}

export default function Stats({ stats }) {
  if (!stats) return null;
  const tiles = STAT_TILES.filter((t) => Number(stats[t.key]) > 0);
  if (!tiles.length) return null;

  return (
    <section className="py-16 bg-brand text-white">
      <div className="container-x">
        <div className="text-center">
          <span className="eyebrow !bg-white/15 !text-white">QuizPe today</span>
          <h2 className="text-3xl font-extrabold mt-4">Real numbers, straight from the platform</h2>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tiles.map((t, i) => (
            <motion.div key={t.key}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="text-center rounded-2xl bg-white/10 p-5">
              <div className="text-2xl sm:text-3xl font-black">
                <Count to={stats[t.key]} suffix={t.suffix || ''} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-white/70 mt-1">{t.label}</div>
            </motion.div>
          ))}
        </div>

        {Number(stats.average_rating) > 0 && stats.ratings_count > 0 && (
          <p className="text-center mt-8 text-white/80 text-sm">
            Rated <b className="text-white">{stats.average_rating}/5</b> by parents
            {' '}({stats.ratings_count} rating{stats.ratings_count === 1 ? '' : 's'})
            {stats.average_score_pct > 0 && <> · average quiz score <b className="text-white">{stats.average_score_pct}%</b></>}
          </p>
        )}
      </div>
    </section>
  );
}
