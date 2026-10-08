/**
 * The notice above everything (user, 2026-10-08): QuizPe now runs in the
 * parent's account at quizpe.in/app. Families who used QuizPe before sign in
 * with the same mobile number and find their children, plan and reports there.
 */
export default function NoticeBanner() {
  return (
    <div role="status" className="w-full bg-emerald-50 border-b border-emerald-200 text-emerald-900">
      <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm leading-snug">
        <span aria-hidden="true">✨ </span>
        <b>QuizPe now runs right here on the web.</b> Already with us? <a href="/app" className="underline font-bold">Sign in</a> with the same mobile number — your children, plan and reports are waiting.
      </div>
    </div>
  );
}
