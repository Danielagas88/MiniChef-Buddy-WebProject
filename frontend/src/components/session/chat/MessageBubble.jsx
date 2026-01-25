/**
 * Individual message bubble component
 */
export default function MessageBubble({ message }) {
  const isBot = message.from === "bot";

  return (
    <div
      className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-bold border shadow-sm transition-all ${
        isBot
          ? "bg-emerald-500/10 text-(--text-primary) border-emerald-500/30 rounded-tl-none mr-auto"
          : "bg-amber-500/10 text-(--text-primary) border-amber-500/30 rounded-tr-none ml-auto"
      }`}
    >
      {message.text}
    </div>
  );
}
