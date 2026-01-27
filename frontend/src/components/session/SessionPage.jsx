/**
 * SessionPage 
 *
 * Cooking session UI: layout, composition, and wiring of useSessionPage.
 * All step/chart/speech/finish and history logic live in useSessionPage.
 *
 * @component
 */
import { useSessionPage } from "../../hooks/useSessionPage.js";

import SessionHeader from "./SessionHeader.jsx";
import SessionChat from "./SessionChat.jsx";
import StepCard from "./StepCard.jsx";
import IngredientsList from "./IngredientsList.jsx";
import FinishModal from "./FinishModal.jsx";

export default function SessionPage() {
  const {
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
  } = useSessionPage();

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

        <div className="lg:col-span-3 space-y-6 flex flex-col">
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
