import { useState, useEffect, useRef, memo } from "react";

function SessionChat({ messages = [], onSend, isBotTyping }) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  }

  return (
    <div className="bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-3xl border border-white/60 dark:border-white/20 flex flex-col h-full overflow-hidden transition-all shadow-sm">
      <div className="bg-white/20 dark:bg-black/20 px-5 py-3 border-b border-white/20 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-black text-(--text-primary)">
            🤖 Cooking Buddy
          </h3>
          {isBotTyping && (
            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 animate-pulse uppercase tracking-widest">
              Thinking...
            </span>
          )}
        </div>

        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
          ONLINE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-bold border shadow-sm transition-all ${
              m.from === "bot"
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-(--text-primary) border-emerald-200 dark:border-emerald-500/30 rounded-tl-none mr-auto"
                : "bg-amber-50 dark:bg-amber-900/30 text-(--text-primary) border-amber-200 dark:border-amber-500/30 rounded-tr-none ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="p-3 border-t border-white/20 bg-white/20 dark:bg-black/20 flex gap-2"
        onSubmit={submit}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask ChefBot..."
          className="flex-1 px-4 py-2 text-sm rounded-full border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 text-(--text-primary) focus:outline-none focus:border-emerald-500 placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-white px-5 py-2 rounded-full font-black text-sm hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default memo(SessionChat);
