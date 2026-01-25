import { useState, useCallback } from "react";
import { sendChefBotMessage } from "../services/geminiService.js";

const initialMessages = [
  {
    id: "bot-init",
    from: "bot",
    text: "Hi! I'm ChefBot. Ask me anything if you need help! 🤖",
  },
];

/**
 * Custom hook for managing chat messages and AI interactions
 */
export function useChatMessages(recipe, currentStepIndex, userToken, onSpeak) {
  const [messages, setMessages] = useState(initialMessages);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const sendMessage = useCallback(
    async (text) => {
      if (!userToken || !recipe) {
        return;
      }

      const userMsg = { id: crypto.randomUUID(), from: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsBotTyping(true);

      try {
        const aiResponseText = await sendChefBotMessage(
          recipe.title,
          recipe.steps[currentStepIndex],
          text,
          userToken
        );

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), from: "bot", text: aiResponseText },
        ]);
        
        if (onSpeak) {
          onSpeak(aiResponseText);
        }
      } catch (error) {
        console.error("Gemini Error:", error);
        const fallback = "You're doing great! Keep going! 👨‍🍳";
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), from: "bot", text: fallback },
        ]);
        
        if (onSpeak) {
          onSpeak(fallback);
        }
      } finally {
        setIsBotTyping(false);
      }
    },
    [recipe, currentStepIndex, userToken, onSpeak],
  );

  return {
    messages,
    isBotTyping,
    sendMessage,
  };
}
