/**
 * Chat header component showing bot name and status
 */
export default function ChatHeader({ isBotTyping }) {
  return (
    <div className="bg-(--input-bg) px-5 py-3 border-b border-(--border-color) flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-sm font-black text-(--text-primary)">
          🤖 Cooking Buddy
        </h3>
        {isBotTyping && (
          <span className="text-[9px] font-black text-(--accent-emerald) animate-pulse uppercase tracking-widest">
            Thinking...
          </span>
        )}
      </div>

      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-(--accent-emerald) border border-emerald-500/20 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
        ONLINE
      </span>
    </div>
  );
}
