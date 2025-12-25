import { useState } from "react";

export default function SessionChat({ messages = [], onSend }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;

    onSend(t); // page expects onSend(text)
    setText("");
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-3xl shadow p-3 md:p-4 flex flex-col h-64">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm md:text-base font-bold text-gray-800">
          🤖 ChefBot – Session Chat
        </h3>
        <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 text-xs md:text-sm pb-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.from === "bot"
                ? "bg-pink-50 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]"
                : "bg-purple-50 text-gray-800 px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%] ml-auto"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <form className="mt-2 flex gap-2" onSubmit={submit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Ask ChefBot about this step..."
          className="flex-1 px-2 py-1.5 text-xs md:text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
          type="submit"
          className="px-3 py-1.5 text-xs md:text-sm bg-pink-500 text-white rounded-full hover:bg-pink-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
