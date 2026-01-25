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
    <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl border border-(--card-surface-border) flex flex-col h-full overflow-hidden transition-all shadow-sm">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-bold border shadow-sm transition-all ${
              m.from === "bot"
                ? "bg-emerald-500/10 text-(--text-primary) border-emerald-500/30 rounded-tl-none mr-auto"
                : "bg-amber-500/10 text-(--text-primary) border-amber-500/30 rounded-tr-none ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="p-3 border-t border-(--border-color) bg-(--input-bg) flex gap-2"
        onSubmit={submit}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask ChefBot..."
          className="flex-1 px-4 py-2 text-sm rounded-full border border-(--border-color) bg-(--card-bg) text-(--text-primary) focus:outline-none focus:border-emerald-500 placeholder:text-(--text-secondary) placeholder:opacity-50"
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
