/**
 * SessionPage
 *
 * Cooking session UI: steps, ingredients, ChefBot chat, and voice control.
 * Saves recipe completion when the user finishes and supports photo upload
 * and navigation to profile or menu.
 *
 * @component
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useVoiceControl } from "../../hooks/useVoiceControl.js";
import { useRecipeLoader } from "../../hooks/useRecipeLoader.js";
import { useImageUpload } from "../../hooks/useImageUpload.js";
import { useChatMessages } from "../../hooks/useChatMessages.js";
import { saveRecipeCompletion } from "../../services/recipeHistoryService.js";
import { analyzeStep, generateSpeechText } from "../../utils/safetyAnalysis.js";

import SessionHeader from "./SessionHeader.jsx";
import SessionChat from "./SessionChat.jsx";
import StepCard from "./StepCard.jsx";
import IngredientsList from "./IngredientsList.jsx";
import FinishModal from "./FinishModal.jsx";

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  // Local state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Custom hooks
  const { recipe, loading, error: recipeError, startedAt } = useRecipeLoader(id);
  const { isVoiceEnabled, isSpeaking, speak, stopSpeaking, toggleVoice } = useVoiceControl();
  const { isUploading, isUploadSuccess, uploadError, uploadImage } = useImageUpload();
  const { messages, isBotTyping, sendMessage } = useChatMessages(
    recipe,
    currentStepIndex,
    user?.token,
    speak
  );

  // --- PROACTIVE SPEAKING ---
  useEffect(() => {
    if (!recipe || !recipe.steps) return;
    const stepText = recipe.steps[currentStepIndex];
    const analysis = analyzeStep(stepText);
    const speechText = generateSpeechText(currentStepIndex, stepText, analysis);
    speak(speechText);
  }, [currentStepIndex, recipe, speak]);

  // --- HANDLERS  ---
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    await uploadImage(file, recipe?.title);
  };

  /**
   * Save recipe completion to history
   * @param {string} [redirectPath="/recipes"] - Path to navigate after saving
   */
  const saveRecipeToHistory = async (redirectPath = "/recipes") => {
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
  };

  const handleFinalizeSession = () => {
    saveRecipeToHistory("/recipes");
  };

  const handleViewProfile = () => {
    saveRecipeToHistory("/progress");
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-bold text-slate-500">
        Loading recipe...
      </div>
    );
  }
  
  if (recipeError || !recipe) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">{recipeError || "Recipe not found."}</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto space-y-6 pb-10 px-4 relative flex flex-col min-h-screen">
      <SessionHeader
        title={recipe.title}
        onBack={() => navigate("/recipes")}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={toggleVoice}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <IngredientsList ingredients={recipe.ingredients} />

        {/* RIGHT COLUMN (75%): Step Card & Progress */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          {/* STEP CARD */}
          <StepCard
            stepText={recipe.steps[currentStepIndex]}
            currentStep={currentStepIndex + 1}
            totalSteps={recipe.steps.length}
            level={recipe.level}
            isSpeaking={isSpeaking}
            onPrev={handlePrev}
            onNext={handleNext}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === recipe.steps.length - 1}
          />
          <div className="w-full bg-(--card-surface) backdrop-blur-md rounded-3xl border border-(--card-surface-border) shadow-sm overflow-hidden h-[300px] flex flex-col transition-all">
            <div className="flex-1 overflow-hidden h-full">
              <SessionChat
                messages={messages}
                onSend={sendMessage}
                isBotTyping={isBotTyping}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FINISH MODAL */}
      {showFinishModal && (
        <FinishModal
          recipeTitle={recipe.title}
          isUploading={isUploading}
          isUploadSuccess={isUploadSuccess}
          uploadError={uploadError}
          onUpload={handleImageUpload}
          onViewProfile={handleViewProfile}
          onDone={handleFinalizeSession}
        />
      )}
    </section>
  );
}
