import { useState, useEffect, useRef } from "react";

export default function SessionChat({ messages = [], onSend }) {
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
    // Updated container background and border for better visibility
    <div className="bg-white rounded-3xl shadow-lg p-4 md:p-6 flex flex-col h-full border-4 border-pink-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-pink-100 pb-3">
        <h3 className="text-lg md:text-xl font-bold text-pink-600 flex items-center gap-2">
          🤖 My Cooking Buddy
        </h3>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-300 animate-pulse">
          Online
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            // === HIGH CONTRAST COLORS ===
            // Bot: Pink-200 background (Darker)
            // User: Purple-300 background (Darker)
            className={`relative px-5 py-3 rounded-2xl max-w-[85%] text-base md:text-lg leading-relaxed shadow-sm font-bold ${
              m.from === "bot"
                ? "bg-pink-200 text-pink-900 rounded-tl-none mr-auto border-2 border-pink-300"
                : "bg-purple-300 text-purple-900 rounded-tr-none ml-auto border-2 border-purple-400"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        className="mt-4 flex gap-2 pt-3 border-t-2 border-pink-100"
        onSubmit={submit}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition bg-gray-50 text-gray-800 font-medium"
        />
        <button
          type="submit"
          className="px-5 py-2 text-sm font-bold bg-pink-500 text-white rounded-full hover:bg-pink-600 shadow-lg transform active:scale-95 transition border-2 border-pink-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
