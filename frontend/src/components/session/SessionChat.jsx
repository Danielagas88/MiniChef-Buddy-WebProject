import { memo } from "react";
import ChatHeader from "./chat/ChatHeader.jsx";
import MessageList from "./chat/MessageList.jsx";
import ChatInput from "./chat/ChatInput.jsx";

/**
 * Main chat component that combines header, messages, and input
 */
function SessionChat({ messages = [], onSend, isBotTyping }) {
  return (
    <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl border border-(--card-surface-border) flex flex-col h-full overflow-hidden transition-all shadow-sm">
      <ChatHeader isBotTyping={isBotTyping} />
      <MessageList messages={messages} />
      <ChatInput onSend={onSend} disabled={isBotTyping} />
    </div>
  );
}

export default memo(SessionChat);
