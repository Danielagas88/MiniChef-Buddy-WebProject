import { useState, useEffect, useCallback } from "react";

/**
 * Strips emojis from text for cleaner Text-to-Speech
 */
function stripEmojis(str) {
  return str
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .trim();
}

/**
 * Custom hook for managing voice/TTS functionality
 */
export function useVoiceControl() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Stop speaking when voice is disabled
  useEffect(() => {
    if (!isVoiceEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isVoiceEnabled]);

  const speak = useCallback(
    (text) => {
      if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const cleanText = stripEmojis(text);
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const preferredVoice =
        voices.find((v) => v.name.includes("Google US English")) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.lang = "en-US";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceEnabled, voices],
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => !prev);
  }, []);

  return {
    isVoiceEnabled,
    isSpeaking,
    speak,
    stopSpeaking,
    toggleVoice,
  };
}
