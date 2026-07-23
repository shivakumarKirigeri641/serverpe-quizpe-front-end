/**
 * All marketing copy in one file, so wording can be revised without touching
 * components — and so nothing contradicts what the product actually does.
 *
 * Every claim here is true of the built system: the spiral revision model, the
 * adaptive question selection, the 7-9 PM window, the daily PDF with drawn
 * explanations, the one-per-mobile trial, and the WhatsApp-only delivery.
 */

export const WHATSAPP_NUMBER = '918618592876';
export const WHATSAPP_DISPLAY = '+91 86185 92876';
export const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=hi`;
// Contacting support is a different intent from enrolling. Sending "hi" would
// drop the parent into the signup flow instead of a conversation.
export const WA_SUPPORT_LINK =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I have a question about QuizPe')}`;
export const SUPPORT_EMAIL = 'support@quizpe.in';

// When we read messages, and how long a parent should expect to wait. Stated in
// one place so the site, the WhatsApp replies and the support ticket page can
// never quote different promises back to the same parent.
export const SUPPORT_HOURS = '9 AM – 6 PM';
export const SUPPORT_SLA = 'within 24–48 hours';
export const SUPPORT_LINE = `We read messages between ${SUPPORT_HOURS} and reply ${SUPPORT_SLA}.`;
// ServerPe App Solutions operates QuizPe. Its address is used for the statutory
// Grievance Officer only — parents should always write to SUPPORT_EMAIL.
export const COMPANY_EMAIL = 'support@serverpe.in';

export const HERO = {
  eyebrow: 'No app · No login · No registration',
  // Sits directly under the headline: the single-line claim, before any detail.
  promise: 'The quickest and simplest way to get a daily quiz to your child.',
  title: 'A daily quiz on WhatsApp that your child will actually finish.',
  sub:
    'Ten fresh questions every evening, matched to your child’s board, grade and everything ' +
    'taught since June. Five to ten minutes before dinner. A full explanation report lands ' +
    'in your chat the moment they finish.',
  ctaNote: 'Say “hi” on WhatsApp. That is the entire signup.',
};

export const HOW_IT_WORKS = [
  {
    step: '1',
    icon: '👋',
    title: 'Say “hi” on WhatsApp',
    body: 'No app to download, no account to create, no password to remember. One message starts everything.',
  },
  {
    step: '2',
    icon: '📝',
    title: 'Tell us about your child',
    body: 'Name, board, grade and medium — a 30-second form. That is all we ask for, and all we keep.',
  },
  {
    step: '3',
    icon: '🔔',
    title: 'A reminder before it starts',
    body: 'One gentle nudge about half an hour ahead, so the evening does not run away. Never more than one. Reply STOP to pause everything, START to resume.',
  },
  {
    step: '4',
    icon: '🎯',
    title: 'Quiz time, 5–10 minutes',
    body: 'A link opens ten questions, one at a time. Your child can go back and change an answer before submitting.',
  },
  {
    step: '5',
    icon: '📄',
    title: 'Report straight away',
    body: 'Score, grade, chapter breakdown and every question explained — as a PDF in your WhatsApp, immediately.',
  },
];

export const FEATURES = [
  {
    icon: '🧠',
    title: 'It adapts to your child',
    body:
      'We watch how your child answers. Master a chapter and the questions move on. Struggle with one ' +
      'and it keeps coming back — mixed in with new work, so they progress without falling behind. ' +
      'Nobody has to tell us what the school is teaching this week.',
  },
  {
    icon: '🔁',
    title: 'Never the same question twice',
    body:
      'Every question your child sees is one they have never been asked before. With tens of thousands ' +
      'of questions per grade, that holds for years, not weeks.',
  },
  {
    icon: '📚',
    title: 'Everything since June, not just this week',
    body:
      'June’s chapters come back in July, July’s in August, and so on. Spaced revision is built into how ' +
      'questions are chosen, so nothing quietly fades before the exam.',
  },
  {
    icon: '✍️',
    title: 'Explanations a child can follow',
    body:
      'Every answer comes with a plain explanation, and for number work we draw it — place-value blocks, ' +
      'number lines, grouped objects. Not just “the answer is 4”.',
  },
  {
    icon: '📈',
    title: 'Progress you can actually see',
    body:
      'Each report compares against the last one: score up or down, faster or slower, which chapters are ' +
      'strong, which need attention, and what to work on next.',
  },
  {
    icon: '⏱️',
    title: 'Speed and streaks',
    body:
      'Average and fastest answer time, personal bests, and a daily streak — the small things that turn ' +
      'practice into a habit children keep on their own.',
  },
  {
    icon: '📖',
    title: 'Revision before exams',
    body:
      'Ahead of school exams the quiz shifts into recall mode across everything covered so far, so your ' +
      'child walks in having already retrieved it once.',
  },
  {
    icon: '🏆',
    title: 'Summer challenges',
    body:
      'Fun quiz competitions during the April–May holidays, so the two months off do not undo ten months ' +
      'of work. Scheduled by how many families join.',
  },
];

export const PARENT_NOTE = {
  title: 'One request, parent to parent',
  body:
    'Please let your child answer on their own. Sit nearby if you like, but do not supply the answer. ' +
    'The report is only useful if it reflects what your child actually knows — and a wrong answer with a ' +
    'good explanation teaches more than a right answer you gave them. You will have the full explanation ' +
    'in your hand within seconds of them finishing.',
};

export const WHY_EVENING = {
  title: 'Why the evening?',
  body:
    'Your nudge arrives between 7 and 9 PM — after school, after tuition, before dinner — and you choose ' +
    'the exact time. But the quiz itself stays open until 11:45 PM, so a late class or a long homework ' +
    'session never costs your child the day. It is deliberately short: five to ten minutes is long enough ' +
    'to matter and short enough that a tired child will still do it.',
};

export const FAQ = [
  {
    q: 'Does my child need a phone?',
    a: 'No, and they do not need one of their own. The quiz arrives on your WhatsApp and opens in a single ' +
       'page. Most parents sit with their child while they answer — you stay in control of the device the ' +
       'whole time, and there is nothing to browse away to. Children never have an account, a login or a ' +
       'password with us.',
  },
  {
    q: 'Is there an app to install?',
    a: 'No. Nothing to download, nothing to update, nothing taking up space. Everything happens in WhatsApp ' +
       'and a single web page that opens from it.',
  },
  {
    q: 'Which boards and grades do you cover?',
    a: 'Today: CBSE/NCERT, ICSE and Karnataka State board — all three, Grades 1 to 10, in English medium. ' +
       'Kannada medium and Science are being written now. A board, grade or subject appears here only once ' +
       'its questions are genuinely ready — so what you see listed is what we can deliver from day one, ' +
       'and nothing is promised before it exists.',
  },
  {
    q: 'What if my child misses a day?',
    a: 'Nothing is lost. The next quiz still arrives, and missed chapters simply come back around through ' +
       'the revision cycle. There is no penalty and no catch-up backlog.',
  },
  {
    q: 'Can I add more than one child?',
    a: 'Yes. Plans cover one, two or three children, each with their own board, grade and progress — every ' +
       'child gets their own quiz and their own report. Every plan includes exactly the same features; the ' +
       'only difference is how many children it covers. For four or more, write to support@quizpe.in and ' +
       'we will set it up for you.',
  },
  {
    q: 'How much does it cost?',
    a: 'Start with the 7-day free trial — it needs no payment details at all and ends by itself. Use those ' +
       'seven days to see whether your child actually sits down and does it. If it works for your family, ' +
       'renew onto a paid plan; if it does not, simply let the trial lapse and nothing is charged. Paid ' +
       'plans start at ₹99 for 28 days, about ₹3.50 a day.',
  },
  {
    q: 'Will you spam me? Who is actually behind this?',
    a: 'No, and you can check exactly who we are. QuizPe is operated by ServerPe App Solutions, a sole ' +
       'proprietorship registered with the Government of India for GST — GSTIN 29BSMPK7696H1ZT — with a ' +
       'named proprietor, a registered business address and a Grievance Officer, all published in the ' +
       'footer of this page. Messages reach you through a Meta-verified WhatsApp Business account, not an ' +
       'anonymous number. In practice that means at most one reminder and one quiz message a day, plus ' +
       'your report. No promotional broadcasts, ever. Reply STOP and every message stops immediately — ' +
       'reply START whenever you want them back.',
  },
  {
    q: 'Where do the questions come from?',
    a: 'We study the syllabus a chapter at a time and then write entirely new questions ourselves on the ' +
       'same concepts. Nothing is copied, scanned or reproduced from any textbook, workbook or publisher — ' +
       'a chapter tells us that a child should be practising place value or regrouping this month, and we ' +
       'compose fresh questions on that idea. We are not affiliated with any board or publisher.',
  },
  {
    q: 'What happens to my child’s data?',
    a: 'We collect the minimum: a name, board, grade, and their answers. No photos, no address, no date of ' +
       'birth. We never sell it, never share it with advertisers, and never report scores to schools.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes — you can stop at any time and your plan simply runs to the end of the period you have already ' +
       'paid for, with no further charge. Paid periods are not refundable, which is exactly why the 7-day ' +
       'free trial exists: try it properly first, and pay only once you know it suits your child.',
  },
];

export const ABOUT = {
  name: 'Shivakumar Kirigeri',
  role: 'Founder · Sole Proprietor, ServerPe App Solutions',
  paragraphs: [
    'I have spent more than fourteen years as a software engineer. I am also the parent of a seven-year-old.',
    'This started at my own dinner table. I kept looking for small, interesting ways to make studying feel ' +
    'less like a chore for my child — a fact here, a puzzle there. It worked. What did not work was every ' +
    'app I tried: another download, another account, another password, another subscription to forget about.',
    'So I built the version I actually wanted. No app. No login. No registration. You say “hi” on WhatsApp, ' +
    'answer a few questions about your child, and the quiz arrives that evening. That is genuinely the whole ' +
    'thing.',
    'QuizPe runs every night, including holidays, because the habit is the point. Ten minutes of recall, a ' +
    'little fun, and an explanation for every question — repeated daily — does more than an hour of cramming ' +
    'once a month.',
    'Today we support CBSE/NCERT, ICSE and Karnataka State board — all three, Grades 1 to 10, in English ' +
    'medium. Kannada medium and Science are being written now, with more languages and subjects after ' +
    'that. I add them only as fast as I can prepare the content properly, because doing it badly would be ' +
    'worse than not doing it at all.',
  ],
  ask:
    'If you find this useful, tell me what is missing. Which board, which grade, which language should come ' +
    'next? I read every message, and what parents ask for is what I build next.',
};

/**
 * The roadmap, staged honestly.
 *
 * `status: 'progress'` means the content is actively being written and will
 * appear soon; 'planned' means it is intended but not started. Saying which is
 * which matters: a parent choosing today should know the difference between
 * "weeks away" and "someday", and a board only ever goes live once its
 * questions are genuinely ready.
 */
export const COMING_SOON = [
  {
    icon: '🗣️', status: 'progress', title: 'Kannada medium',
    body: 'In progress. Hindi, Urdu and other languages follow — the quiz and report engine already handles them.',
  },
  {
    icon: '🔬', status: 'progress', title: 'Science',
    body: 'In progress alongside Mathematics. Social Science, English and EVS come after.',
  },
  {
    icon: '🏫', status: 'planned', title: 'Schools & tuition centres',
    body: 'Bulk enrolment with a teacher view. Get in touch if that is you.',
  },
];

/** Fallbacks so the page never looks broken before the API responds. */
export const STAT_TILES = [
  { key: 'questions_available', label: 'Questions ready to ask', suffix: '+' },
  { key: 'parents', label: 'Parents enrolled' },
  { key: 'students', label: 'Children practising' },
  { key: 'quizzes_delivered', label: 'Quizzes delivered' },
  { key: 'reports_generated', label: 'Reports sent' },
  { key: 'boards_live', label: 'Boards supported' },
];
