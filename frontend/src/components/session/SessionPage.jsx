import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchRecipeById } from "../../services/recipeService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { saveRecipeCompletion } from "../../services/recipeHistoryService.js";
import SessionHeader from "./SessionHeader.jsx";
import StepProgress from "./StepProgress.jsx";
import SessionChat from "./SessionChat.jsx";

// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// List of models to try (Priority: Flash 2.5 -> Flash 2.0 -> Flash 1.5)
const MODEL_CASCADE = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

// Initialize Google AI
const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

// --- FALLBACK LOGIC (Offline Mode) ---
function getFallbackReply(userText, recipe, currentStepIndex) {
  const text = userText.toLowerCase();
  const currentStep = recipe?.steps[currentStepIndex]?.toLowerCase() || "";

  // 1. Safety Checks
  if (
    currentStep.includes("oven") ||
    currentStep.includes("bake") ||
    currentStep.includes("heat")
  ) {
    return "⚠️ Careful! It's hot. Make sure an adult is watching!";
  }
  if (
    currentStep.includes("knife") ||
    currentStep.includes("cut") ||
    currentStep.includes("chop")
  ) {
    return "🔪 Watch your fingers! Ask an adult for help with cutting.";
  }

  // 2. Simple Interaction
  if (text.includes("next"))
    return "Click the 'Next Step' button when you are ready! ▶️";
  if (text.includes("help")) return "I'm here! What do you need help with? 🆘";
  if (text.includes("hi") || text.includes("hello"))
    return "Hello! Ready to cook? 🍳";
  if (text.includes("done") || text.includes("finish"))
    return "Great job! Let's move on! 🌟";

  // 3. Default Encouragement
  return "You are doing great! Keep following the steps. 👨‍🍳";
}

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // stable per page session
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Load Recipe Data
  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      const data = await fetchRecipeById(id);

      if (data) {
        setRecipe(data);
        const isHot = data.level === "Advanced" || data.level === "Medium";
        const welcomeMsg = `Hi! I'm ChefBot 🤖! Let's cook "${data.title}". ${
          isHot ? "Watch out for heat!" : "Have fun!"
        }`;

        setMessages([{ id: "bot-init", from: "bot", text: welcomeMsg }]);
      }
      setLoading(false);
    }
    loadRecipe();
  }, [id]);

  // --- SMART AI LOGIC (With Fallback) ---
  async function callGeminiAI(userText) {
    // If no key, immediately use fallback
    if (!API_KEY) {
      return getFallbackReply(userText, recipe, currentStepIndex);
    }

    try {
      setIsBotTyping(true);

      const currentStepText = recipe.steps[currentStepIndex];
      const prompt = `
        You are "ChefBot", a cooking assistant for a child.
        Context: Recipe "${recipe.title}", Step ${
        currentStepIndex + 1
      }: "${currentStepText}".
        User says: "${userText}"
        Reply: Short (max 20 words), encouraging, safe, use emojis.
      `;

      // Try models one by one
      for (const modelName of MODEL_CASCADE) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text(); // Success!
        } catch {
          // Flattened catch block: We don't need the error variable here, just try the next one.
          console.warn(`Model ${modelName} failed, trying next...`);
        }
      }

      // If all models failed -> Use Fallback
      throw new Error("All AI models failed");
    } catch {
      // Flattened catch block: We don't need the error details, just switch to fallback.
      console.error("AI Unavailable, switching to manual mode.");
      return getFallbackReply(userText, recipe, currentStepIndex);
    } finally {
      setIsBotTyping(false);
    }
  }

  // --- HANDLERS ---
  const handleNext = () => {
    if (currentStepIndex === recipe.steps.length - 1) {
      setShowFinishModal(true);
    } else {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  const handlePrev = () => setCurrentStepIndex((i) => Math.max(0, i - 1));

  async function sendMessage(text) {
    const userMsg = { id: crypto.randomUUID(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    const aiResponseText = await callGeminiAI(text);

    const botMsg = {
      id: crypto.randomUUID(),
      from: "bot",
      text: aiResponseText,
    };
    setMessages((prev) => [...prev, botMsg]);
  }

  if (loading)
    return <div className="p-10 text-center text-xl">Loading recipe...</div>;
  if (!recipe) return <div className="p-10">Recipe not found.</div>;

  return (
    <section className="max-w-6xl mx-auto space-y-6 pb-10 px-4 relative">
      <SessionHeader title={recipe.title} onBack={() => navigate("/recipes")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <StepProgress
            current={currentStepIndex + 1}
            total={recipe.steps.length}
          />

          <div className="bg-orange-50 rounded-3xl border-2 border-orange-200 p-6 shadow-sm">
            <h3 className="font-bold text-orange-700 text-xl mb-4 flex items-center gap-2">
              🛒 Ingredients
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800 font-medium">
              {recipe.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 bg-white p-2 rounded-lg border border-orange-100"
                >
                  <span className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0"></span>{" "}
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[300px] flex flex-col justify-between relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-bl-full -z-0 opacity-60"></div>
            <div className="z-10 relative">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold tracking-wide mb-6 ${
                  recipe.level === "Advanced"
                    ? "bg-red-100 text-red-600"
                    : recipe.level === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                STEP {currentStepIndex + 1} • {recipe.level}
              </span>
              <p className="text-2xl md:text-3xl text-gray-800 font-medium leading-relaxed">
                {recipe.steps[currentStepIndex]}
              </p>
            </div>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-6 py-3 rounded-full text-gray-500 font-bold hover:bg-gray-100 disabled:opacity-30 text-lg transition"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className={`px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg transition transform hover:scale-105 ${
                  currentStepIndex === recipe.steps.length - 1
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {currentStepIndex === recipe.steps.length - 1
                  ? "Finish! 🎉"
                  : "Next Step →"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chatbot */}
        <aside className="h-full flex flex-col">
          <div className="sticky top-4 flex-1 h-full">
            <SessionChat messages={messages} onSend={sendMessage} />
            {isBotTyping && (
              <div className="absolute bottom-20 left-6 text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow border animate-pulse z-50">
                ChefBot is thinking... 🤔
              </div>
            )}
          </div>
        </aside>
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-105 transition-all relative">
            <div className="text-6xl mb-4">👨‍🍳🎉👩‍🍳</div>
            <h2 className="text-3xl font-bold text-pink-600 mb-2">
              Great Job!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              You finished cooking <b>{recipe.title}</b>!<br />
              That looks delicious!
            </p>
            <button
              onClick={async () => {
                try {
                  // save only if logged-in
                  if (user?.token) {
                    await saveRecipeCompletion({
                      recipe,
                      token: user.token,
                      sessionId,
                    });
                  }
                } catch (e) {
                  console.error("Failed to save recipe completion:", e);
                } finally {
                  navigate("/recipes");
                }
              }}
              className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-xl hover:bg-pink-600 shadow-lg transition"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
