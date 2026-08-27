/**
 * Bring QuizPe to your school — the invitation-led demo programme.
 *
 * Deliberately invitation-only: we do not cold-call schools. A parent already
 * using QuizPe, or anyone at the school, invites us; we present to the teachers
 * and leadership; the school then shares pamphlets with students, who take them
 * home. That order matters — a school that invited us introduces us to parents
 * with its own credibility behind it, which no advertisement buys.
 *
 * Invitations arrive by email so there is a written record with dates and a
 * named contact, and so the two-week lead time is respected. The mailto below
 * pre-fills every detail we need, because an email that arrives missing the
 * class count or the preferred dates costs another round trip.
 */
import Reveal from '../components/Reveal.jsx';
import { SUPPORT_EMAIL } from '../content';

const STEPS = [
  ['📨', 'You invite us', 'A parent already using QuizPe, or a teacher, principal or coordinator, emails us an invitation — at least 1–2 weeks ahead.'],
  ['📅', 'We confirm a slot', 'We reply with a confirmed date and time that suits the school, and prepare material for your boards and classes.'],
  ['🎤', 'We present to your staff', 'A short, no-obligation session for teachers, the principal and coordinators — what daily revision looks like, and how progress is reported.'],
  ['📄', 'Pamphlets go home', 'The school shares our pamphlets with students, who carry them home — so parents hear about it from a source they already trust.'],
];

const INCLUDE = [
  'School name, city and state',
  'Your name, role and mobile number',
  'Boards and classes taught (e.g. CBSE, classes 4–8)',
  'Roughly how many students',
  'Two or three preferred dates and times',
  'In person or online',
];

/** Pre-filled invitation so nothing essential is left out. */
const SUBJECT = 'Demo invitation for QuizPe';
const BODY = [
  'Hello QuizPe team,',
  '',
  'We would like to invite you to give a demo at our school.',
  '',
  'School name:',
  'City / State:',
  'Contact person:',
  'Role:',
  'Mobile number:',
  'Boards & classes:',
  'Approximate number of students:',
  'Preferred dates & times (2–3 options):',
  'In person or online:',
  '',
  'Thank you,',
].join('\n');

const MAILTO = `mailto:${SUPPORT_EMAIL}`
  + `?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

export default function SchoolDemo() {
  return (
    <section id="schools" className="py-20 bg-white/60">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">For schools</span>
          <h2 className="h2 mt-4">Invite us to your school</h2>
          <p className="lede mt-3">
            We do not cold-call schools. If you would like your teachers and parents to see what daily
            revision on WhatsApp actually looks like, send us an invitation — and we will come and show you.
          </p>
        </Reveal>

        {/* who may invite — the two audiences, said plainly */}
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
            <div className="card p-6">
              <span className="text-2xl" aria-hidden>👨‍👩‍👧</span>
              <h3 className="font-extrabold text-brand mt-3">Already a QuizPe parent?</h3>
              <p className="text-sm text-muted mt-1">
                Ask your child's school to invite us, or send the invitation yourself with the school's
                permission. Nothing is shared about your child.
              </p>
            </div>
            <div className="card p-6">
              <span className="text-2xl" aria-hidden>🏫</span>
              <h3 className="font-extrabold text-brand mt-3">Teacher, principal or coordinator?</h3>
              <p className="text-sm text-muted mt-1">
                Invite us directly. The session is free, carries no obligation, and takes about 30 minutes.
              </p>
            </div>
          </div>
        </Reveal>

        {/* the sequence, because "what actually happens" is the real question */}
        <Reveal delay={0.1}>
          <h3 className="text-center font-extrabold text-brand text-lg mt-14">How a school demo works</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([icon, title, body], i) => (
              <div key={title} className="card p-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none" aria-hidden>{icon}</span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-accent">
                    Step {i + 1}
                  </span>
                </div>
                <p className="font-bold text-brand mt-2.5">{title}</p>
                <p className="text-sm text-muted leading-relaxed mt-1">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* what to write, and the one-click way to write it */}
        <Reveal delay={0.15}>
          <div className="mt-12 card p-6 sm:p-8 max-w-3xl mx-auto border-2 border-brand-accent/30">
            <div className="grid gap-8 sm:grid-cols-[1.1fr,.9fr]">
              <div>
                <h3 className="font-extrabold text-brand text-lg">Please include</h3>
                <ul className="mt-3 space-y-1.5">
                  {INCLUDE.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-muted">
                      <span className="text-brand-accent" aria-hidden>✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-center">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-extrabold text-amber-800">⏳ Please give 1–2 weeks' notice</p>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                    It lets us prepare material for your exact boards and classes, and print enough
                    pamphlets for every student.
                  </p>
                </div>

                <a href={MAILTO} className="btn-wa !py-3 mt-4 text-center">
                  ✉️ Email your invitation
                </a>
                <p className="text-xs text-muted mt-2 text-center">
                  Opens your mail app with the details ready to fill in — or write to{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand hover:text-brand-accent">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-center text-sm text-muted mt-8 max-w-xl mx-auto">
            The demo is free and there is nothing to sign. Schools are never charged, and we never ask a
            school for student contact details.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
