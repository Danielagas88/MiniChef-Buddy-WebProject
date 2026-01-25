import { useState } from "react";

/**
 * Chat input component with form handling
 */
export default function ChatInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || disabled) return;
    
    onSend(trimmedText);
    setText("");
  }

  function handleKeyDown(e) {
    // Allow Shift+Enter for new line, Enter to send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      className="p-3 border-t border-(--border-color) bg-(--input-bg) flex gap-2"
      onSubmit={handleSubmit}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask ChefBot..."
        disabled={disabled}
        className="flex-1 px-4 py-2 text-sm rounded-full border border-(--border-color) bg-(--card-bg) text-(--text-primary) focus:outline-none focus:border-emerald-500 placeholder:text-(--text-secondary) placeholder:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Type your message to ChefBot"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-emerald-500 text-white px-5 py-2 rounded-full font-black text-sm hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}
