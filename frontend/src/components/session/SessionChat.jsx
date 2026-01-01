import { useState, useEffect, useRef } from "react";

export default function SessionChat({
  messages = [],
  onSend,
  isVoiceEnabled,
  onToggleVoice,
}) {
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
    /* 1. Container Frame (Restored) - Emerald Border & Shadow */
    <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 flex flex-col h-full overflow-hidden">
      {/* 2. Header (Restored) - Title + Controls */}
      <div className="bg-slate-50 px-5 py-3 border-b border-emerald-50 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-bold text-slate-700 flex items-center gap-2">
          🤖 My Cooking Buddy
        </h3>

        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          <button
            onClick={onToggleVoice}
            type="button"
            className={`p-2 rounded-full transition-all duration-200 ${
              isVoiceEnabled
                ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                : "bg-slate-200 text-slate-400 hover:bg-slate-300"
            }`}
            title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
          >
            {isVoiceEnabled ? "🔊" : "🔇"}
          </button>

          {/* Online Badge */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Online
          </span>
        </div>
      </div>

      {/* 3. Messages Area - Emerald (Bot) & Amber (User) Bubbles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`relative px-4 py-2.5 rounded-2xl max-w-[85%] text-sm md:text-base leading-snug shadow-sm font-medium border ${
              m.from === "bot"
                ? "bg-emerald-50 text-emerald-900 rounded-tl-none mr-auto border-emerald-100" // Bot style
                : "bg-amber-50 text-amber-900 rounded-tr-none ml-auto border-amber-100" // User style
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Area */}
      <form
        className="p-3 border-t border-emerald-50 bg-slate-50 flex gap-2"
        onSubmit={submit}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Ask ChefBot..."
          className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition bg-white text-slate-800"
        />
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-bold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 shadow-md transform active:scale-95 transition flex items-center gap-1"
        >
          Send
        </button>
      </form>
    </div>
  );
}
