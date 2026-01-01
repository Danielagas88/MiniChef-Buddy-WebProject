import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { galleryService } from "../../services/galleryService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchRecipeById } from "../../services/recipeService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { saveRecipeCompletion } from "../../services/recipeHistoryService.js";
import SessionHeader from "./SessionHeader.jsx";
import SessionChat from "./SessionChat.jsx";
import StepCard from "./StepCard.jsx";

// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

// --- 1. RESPONSE BANK & CONSTANTS ---
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SHORT_PRAISES = [
  "Great job!",
  "Awesome!",
  "Well done!",
  "You're doing great!",
  "Next step!",
  "Keep it up!",
];

const SAFETY_OVEN = [
  "Wait! The oven is very hot. Please ask an adult to help.",
  "Stop! Oven alert. Do not touch it without an adult.",
  "Hot zone! Let a grown-up handle the oven.",
];

const SAFETY_HEAT = [
  "Careful with the heat! Make sure an adult is watching.",
  "It's getting hot! Step back and ask for help.",
  "Boiling water is dangerous. Ask for help!",
];

const SAFETY_KNIFE = [
  "Sharp object alert! Watch your fingers.",
  "Wait! Knives are sharp. Ask an adult to cut.",
  "Cutting time! Please let an adult handle the knife.",
];

/**
 * Helper: Analyzes current step text for safety keywords
 */
function analyzeStep(stepText) {
  const text = stepText.toLowerCase();
  if (
    text.includes("oven") ||
    text.includes("bake") ||
    text.includes("roast")
  ) {
    return { type: "safety", text: getRandom(SAFETY_OVEN) };
  }
  if (
    text.includes("boil") ||
    text.includes("hot water") ||
    text.includes("stove") ||
    text.includes("fry")
  ) {
    return { type: "safety", text: getRandom(SAFETY_HEAT) };
  }
  if (
    text.includes("knife") ||
    text.includes("chop") ||
    text.includes("slice") ||
    text.includes("cut")
  ) {
    return { type: "safety", text: getRandom(SAFETY_KNIFE) };
  }
  return { type: "normal", text: "" };
}

/**
 * Helper: Strips emojis from text for cleaner Text-to-Speech
 */
function stripEmojis(str) {
  return str
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    )
    .trim();
}

/**
 * Component: Animated Robot Icon
 */
function SpeakingRobot({ isSpeaking }) {
  return (
    <div
      className={`text-6xl md:text-7xl transition-transform duration-300 ${
        isSpeaking ? "animate-bounce" : ""
      }`}
    >
      🤖
    </div>
  );
}

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const startedAtRef = useRef(Date.now());

  // --- STATE ---
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Voice & Animation
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Upload Logic States
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  // --- EFFECT: Load Voices ---
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /**
   * TTS Function
   */
  const speak = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
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
  };

  /**
   * Handler: Upload image to Cloudinary and save URL to DB
   */
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Cloudinary Upload failed");

      const imageUrl = data.secure_url;

      // Save to our backend
      await galleryService.addToGallery(
        imageUrl,
        `Cooked ${recipe?.title || "something yummy"}`
      );

      setIsUploadSuccess(true);
      alert("Photo saved successfully! 📸");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Oops! Could not save the photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Load Recipe Data
  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      const data = await fetchRecipeById(id);
      if (data) {
        setRecipe(data);
        startedAtRef.current = Date.now();
        setMessages([
          {
            id: "bot-init",
            from: "bot",
            text: "Hi! I'm ChefBot. Ask me anything if you need help! 🤖",
          },
        ]);
      }
      setLoading(false);
    }
    loadRecipe();
  }, [id]);

  // Proactive Step Speaking
  useEffect(() => {
    if (!recipe || !recipe.steps) return;
    const stepText = recipe.steps[currentStepIndex];
    const analysis = analyzeStep(stepText);
    let speechText =
      currentStepIndex === 0
        ? `Hi, I am ChefBot! Lets start cooking together ... ${stepText}`
        : analysis.type === "safety"
        ? `${analysis.text} ... ... ${stepText}`
        : `${getRandom(SHORT_PRAISES)} ... ${stepText}`;
    speak(speechText);
  }, [currentStepIndex, recipe]);

  const handleNext = () => {
    window.speechSynthesis.cancel();
    if (currentStepIndex === recipe.steps.length - 1) {
      speak("Great job! You finished cooking! That looks delicious!");
      setShowFinishModal(true);
    } else {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    window.speechSynthesis.cancel();
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  };

  // --- CHAT HANDLER ---
  async function sendMessage(text) {
    // Add user message to state
    const userMsg = { id: crypto.randomUUID(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setIsBotTyping(true);

    try {
      const prompt = `You are ChefBot. Recipe: ${recipe.title}. Step: ${recipe.steps[currentStepIndex]}. User query: "${text}". Reply: Short, safe, and encouraging.`;

      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const result = await model.generateContent(prompt);
      const aiResponseText = result.response.text();

      // Add bot response to state
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: "bot", text: aiResponseText },
      ]);
      speak(aiResponseText);
    } catch (error) {
      console.error("Gemini Error:", error);
      const fallback = "You're doing great! Keep going! 👨‍🍳";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: "bot", text: fallback },
      ]);
      speak(fallback);
    } finally {
      setIsBotTyping(false);
    }
  }

  if (loading)
    return (
      <div className="p-10 text-center text-xl font-bold text-slate-500">
        Loading recipe...
      </div>
    );
  if (!recipe) return <div className="p-10 text-center">Recipe not found.</div>;

  return (
    <section className="max-w-7xl mx-auto space-y-6 pb-10 px-4 relative flex flex-col min-h-screen">
      <SessionHeader title={recipe.title} onBack={() => navigate("/recipes")} />

      {/* --- NEW LAYOUT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 bg-amber-50 rounded-3xl border-2 border-amber-200 p-6 shadow-sm h-full max-h-[650px] overflow-y-auto">
          <h3 className="font-bold text-amber-700 text-xl mb-4 flex items-center gap-2 sticky top-0 bg-amber-50 pb-2 border-b border-amber-200">
            🛒 Ingredients
          </h3>
          <ul className="space-y-3 text-slate-700 font-medium">
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-white p-3 rounded-xl border border-amber-100 shadow-sm"
              >
                <span className="w-2 h-2 mt-2 bg-amber-400 rounded-full flex-shrink-0"></span>
                <span className="text-sm leading-snug">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

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
          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[300px] flex flex-col">
            {isBotTyping && (
              <span className="text-xs text-slate-400 animate-pulse">
                Thinking...
              </span>
            )}
            <div className="flex-1 overflow-hidden h-full">
              <SessionChat
                messages={messages}
                onSend={sendMessage}
                isVoiceEnabled={isVoiceEnabled}
                onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FINISH MODAL */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6 border border-emerald-100">
            <div className="text-6xl animate-bounce">👨‍🍳🎉👩‍🍳</div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              Great Job!
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              You finished cooking <b>{recipe.title}</b>!<br />
              That looks delicious!
            </p>

            <div className="space-y-3">
              {!isUploadSuccess ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  <button
                    className={`w-full py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition ${
                      isUploading
                        ? "bg-slate-100 text-slate-400"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {isUploading ? "Uploading..." : "📸 Upload Photo"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/progress")}
                  className="w-full py-3 rounded-xl font-bold shadow-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center gap-2 animate-bounce-in"
                >
                  🖼️ View in My Profile
                </button>
              )}

              <button
                onClick={async () => {
                  try {
                    if (user?.token) {
                      const minutes = Math.max(
                        0,
                        Math.round((Date.now() - startedAtRef.current) / 60000)
                      );
                      await saveRecipeCompletion({
                        recipe,
                        token: user.token,
                        sessionId,
                        minutes,
                      });
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    navigate("/recipes");
                  }
                }}
                className="w-full py-3 rounded-xl bg-amber-400 text-slate-800 font-bold text-lg hover:bg-amber-500 shadow-md transition"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
