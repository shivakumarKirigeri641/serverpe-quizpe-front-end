/** The one thing that matters: say hi. QR for desktop, button for phones. */
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { HERO, WA_LINK, WHATSAPP_DISPLAY } from '../content';

export default function Hero({ stats }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 via-cream to-cream" aria-hidden />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-accent/10 blur-3xl" aria-hidden />

      <div className="container-x relative pt-14 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-[1.15fr,.85fr] gap-12 items-center">
        <div>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: .5 }} className="eyebrow">{HERO.eyebrow}</motion.span>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: .6, delay: .05 }}
                     className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-brand leading-[1.08]">
            {HERO.title}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .6, delay: .1 }}
                    className="mt-4 text-lg sm:text-xl font-bold text-brand-accent max-w-xl">
            {HERO.promise}
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .6, delay: .15 }} className="mt-4 lede max-w-xl">
            {HERO.sub}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: .6, delay: .25 }}
                      className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa text-base">
              <span aria-hidden>💬</span> Say “hi” on WhatsApp
            </a>
            <a href="#how-it-works" className="btn-ghost">See how it works</a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
                    className="mt-4 text-sm text-muted">
            {HERO.ctaNote} <span className="font-bold text-brand">{WHATSAPP_DISPLAY}</span>
          </motion.p>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
                     className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-brand">
            {/* Only boards we can actually deliver today. ICSE is in progress and
                is listed under "Coming next", never claimed as available. */}
            {['Free trial, no card', 'Grades 1–10', 'CBSE · Karnataka State', 'Report every day'].map(t => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="text-brand-accent" aria-hidden>✓</span>{t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* QR: on a laptop you scan it; on a phone the button above is the path */}
        <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: .6, delay: .2 }} className="justify-self-center">
          <div className="card p-7 text-center max-w-xs animate-float">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Scan to start</p>
            <div className="my-4 inline-block p-3 bg-white rounded-2xl border-2 border-line">
              <QRCodeCanvas value={WA_LINK} size={168} level="M" includeMargin={false}
                            fgColor="#075e54" bgColor="#ffffff" />
            </div>
            <p className="font-bold text-brand">{WHATSAPP_DISPLAY}</p>
            <p className="text-xs text-muted mt-1">Opens WhatsApp with “hi” ready to send</p>
            {stats?.questions_available > 0 && (
              <p className="mt-4 pt-4 border-t border-line text-xs text-muted">
                <b className="text-brand">{Number(stats.questions_available).toLocaleString('en-IN')}</b> questions
                ready across {stats.grades_live} grades
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
