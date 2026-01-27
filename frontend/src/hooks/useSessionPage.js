/**
 * useSessionPage (functionality)
 *
 * Owns cooking-session state, step navigation, proactive speech, chat,
 * finish flow, and saving completion to history. Keeps SessionPage
 * presentational (layout and composition only).
 *
 * @returns {Object} Session state and handlers for the session UI
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./useAuth.js";
import { useVoiceControl } from "./useVoiceControl.js";
import { useRecipeLoader } from "./useRecipeLoader.js";
import { useImageUpload } from "./useImageUpload.js";
import { useChatMessages } from "./useChatMessages.js";
import { saveRecipeCompletion } from "../services/recipeHistoryService.js";
import { analyzeStep, generateSpeechText } from "../utils/safetyAnalysis.js";

export function useSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const { recipe, loading, error: recipeError, startedAt } = useRecipeLoader(id);
  const { isVoiceEnabled, isSpeaking, speak, stopSpeaking, toggleVoice } = useVoiceControl();
  const { isUploading, isUploadSuccess, uploadError, uploadImage } = useImageUpload();
  const { messages, isBotTyping, sendMessage } = useChatMessages(
    recipe,
    currentStepIndex,
    user?.token,
    speak
  );

  useEffect(() => {
    if (!recipe || !recipe.steps) return;
    const stepText = recipe.steps[currentStepIndex];
    const analysis = analyzeStep(stepText);
    const speechText = generateSpeechText(currentStepIndex, stepText, analysis);
    speak(speechText);
  }, [currentStepIndex, recipe, speak]);

  const handleNext = useCallback(() => {
    stopSpeaking();
    if (currentStepIndex === recipe?.steps.length - 1) {
      speak("Great job! You finished cooking!");
      setShowFinishModal(true);
    } else {
      setCurrentStepIndex((i) => i + 1);
    }
  }, [currentStepIndex, recipe, speak, stopSpeaking]);

  const handlePrev = useCallback(() => {
    stopSpeaking();
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  }, [stopSpeaking]);

  const handleImageUpload = useCallback(
    async (event) => {
      const file = event?.target?.files?.[0];
      if (file) await uploadImage(file, recipe?.title);
    },
    [recipe?.title, uploadImage]
  );

  const saveRecipeToHistory = useCallback(
    async (redirectPath = "/recipes") => {
      try {
        if (user?.token && recipe && startedAt) {
          const minutes = Math.max(
            0,
            Math.round((Date.now() - startedAt) / 60000),
          );
          await saveRecipeCompletion({
            recipe,
            token: user.token,
            sessionId,
            minutes,
          });
        }
      } catch (e) {
        console.error("Error saving session:", e);
      } finally {
        navigate(redirectPath);
      }
    },
    [user?.token, recipe, startedAt, sessionId, navigate]
  );

  const handleFinalizeSession = useCallback(
    () => saveRecipeToHistory("/recipes"),
    [saveRecipeToHistory]
  );

  const handleViewProfile = useCallback(
    () => saveRecipeToHistory("/progress"),
    [saveRecipeToHistory]
  );

  return {
    recipe,
    loading,
    recipeError,
    currentStepIndex,
    showFinishModal,
    messages,
    isBotTyping,
    sendMessage,
    isVoiceEnabled,
    toggleVoice,
    isSpeaking,
    handleNext,
    handlePrev,
    handleImageUpload,
    handleViewProfile,
    handleFinalizeSession,
    isUploading,
    isUploadSuccess,
    uploadError,
    navigate,
  };
}
