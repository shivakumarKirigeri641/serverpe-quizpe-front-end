/**
 * The service notice above everything (user, 2026-10-07): WhatsApp is disabled
 * for QuizPe while the alternatives are built. Always shown — it is the reason
 * a parent's WhatsApp quiz has stopped — and not dismissible for that reason.
 */
export default function NoticeBanner() {
  return (
    <div role="status" className="w-full bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm leading-snug">
        <span aria-hidden="true">⚠️ </span>
        <b>WhatsApp has been disabled for QuizPe.</b> We are in the process of implementing the alternatives. Stay tuned.
      </div>
    </div>
  );
}
