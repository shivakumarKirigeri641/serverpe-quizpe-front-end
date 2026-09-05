/**
 * SendHint — the line that sits under every "say hi" button.
 *
 * Why this exists: of 134 people who tapped a WhatsApp button, only 28 actually
 * sent the message. The site had already done its job — they had decided — and
 * then 106 of them stopped at the one step nothing on the page prepared them
 * for: WhatsApp opens with the text already typed, and they still have to press
 * send. This says so, in advance, wherever the button is.
 */
export default function SendHint({ tone = 'light', className = '' }) {
  const muted = tone === 'dark' ? 'text-white/70' : 'text-muted';
  const strong = tone === 'dark' ? 'text-white' : 'text-brand';
  return (
    <p className={`text-[13px] leading-relaxed ${muted} ${className}`}>
      WhatsApp opens with your message already typed —{' '}
      <b className={strong}>just press send ➤</b>
      <span className="block mt-0.5">
        No payment, nothing to install. Your child’s first quiz arrives in about two minutes.
      </span>
    </p>
  );
}
