/**
 * SendHint — the line that sits under every start button: what happens next,
 * so nobody stops at a step they were not expecting. Sign-in is a mobile
 * number and an SMS code (quizpe.in/app, 2026-10-08).
 */
export default function SendHint({ tone = 'light', className = '' }) {
  const muted = tone === 'dark' ? 'text-white/70' : 'text-muted';
  const strong = tone === 'dark' ? 'text-white' : 'text-brand';
  return (
    <p className={`text-[13px] leading-relaxed ${muted} ${className}`}>
      Sign in with your mobile number —{' '}
      <b className={strong}>we send a one-time code by SMS</b>
      <span className="block mt-0.5">
        No payment, nothing to install. Your child’s first quiz is ready in about two minutes.
      </span>
    </p>
  );
}
