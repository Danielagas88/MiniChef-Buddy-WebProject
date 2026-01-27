/**
 * SessionChat
 *
 * Chat panel for the cooking session: header (ChefBot, typing indicator),
 * message list, and input. Used inside SessionPage.
 *
 * @param {Object} props
 * @param {Object[]} [props.messages=[]] - Chat messages
 * @param {Function} props.onSend - Send message handler
 * @param {boolean} [props.isBotTyping] - Whether ChefBot is typing
 *
 * @component
 */
import { memo } from "react";
import ChatHeader from "./chat/ChatHeader.jsx";
import MessageList from "./chat/MessageList.jsx";
import ChatInput from "./chat/ChatInput.jsx";

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
