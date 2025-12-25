import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recipes } from "../data/fakeData.js";
import SessionHeader from "../components/session/SessionHeader.jsx";
import StepProgress from "../components/session/StepProgress.jsx";
import StepPanel from "../components/session/StepPanel.jsx";
import SessionChat from "../components/session/SessionChat.jsx";

function generateBotReply(text, recipe, currentStepIndex) {
  const q = text.toLowerCase();

  if (!recipe)
    return "First choose a recipe from the Recipes screen, then I can help you.";

  if (q.includes("safety") || q.includes("danger") || q.includes("safe")) {
    return `One safety tip for this recipe: ${recipe.safetyTips[0]}`;
  }

  if (q.includes("next") || q.includes("step") || q.includes("how")) {
    return `You are now on step ${
      currentStepIndex + 1
    }. Read it slowly and ask an adult for help if needed.`;
  }

  return "Remember to follow the steps in order and always ask an adult for help with hot or sharp things. 😊";
}

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const recipe = useMemo(() => recipes.find((r) => r.id === Number(id)), [id]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState(() =>
    recipe
      ? [
          {
            id: crypto.randomUUID(),
            from: "bot",
            text: `Hi! Let's cook "${recipe.title}" together. Start with step 1 and click "Next step" when you are ready.`,
          },
        ]
      : []
  );

  if (!recipe) {
    return (
      <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-4">
        <p className="text-sm text-gray-700">Recipe not found.</p>
        <button
          onClick={() => navigate("/recipes")}
          className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-pink-500 text-white hover:bg-pink-600"
        >
          Back to recipes
        </button>
      </section>
    );
  }

  const totalSteps = recipe.steps.length;

  function prev() {
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setCurrentStepIndex((i) => Math.min(totalSteps - 1, i + 1));
  }

  function sendMessage(text) {
    const userMsg = { id: crypto.randomUUID(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    const replyText = generateBotReply(text, recipe, currentStepIndex);
    const botMsg = { id: crypto.randomUUID(), from: "bot", text: replyText };

    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 200);
  }

  return (
    <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-4">
      <SessionHeader title={recipe.title} onBack={() => navigate("/recipes")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-3">
          <StepProgress current={currentStepIndex + 1} total={totalSteps} />

          <StepPanel
            stepText={recipe.steps[currentStepIndex]}
            onPrev={prev}
            onNext={next}
            disablePrev={currentStepIndex === 0}
            disableNext={currentStepIndex === totalSteps - 1}
          />
        </div>

        <aside className="space-y-3">
          <SessionChat messages={messages} onSend={sendMessage} />
        </aside>
      </div>
    </section>
  );
}
