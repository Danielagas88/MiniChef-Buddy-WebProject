import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { recipes } from "../data/fakeData.js";

function generateBotReply(text, recipe, currentStepIndex) {
  const q = text.toLowerCase();

  if (!recipe) {
    return "First choose a recipe from the Recipes screen, then I can help you.";
  }

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

  // מוצאים את המתכון לפי ה-id ב־URL
  const recipe = useMemo(() => recipes.find((r) => r.id === Number(id)), [id]);

  // האינדקס של הצעד הנוכחי – מתחילים מ־0
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // מאתחלים את ההודעות פעם אחת לפי המתכון (אם נמצא)
  const [messages, setMessages] = useState(() =>
    recipe
      ? [
          {
            id: 1,
            from: "bot",
            text: `Hi! Let's cook "${recipe.title}" together. Start with step 1 and click "Next step" when you are ready.`,
          },
        ]
      : []
  );

  // אם אין מתכון מתאים – הודעת שגיאה וכפתור חזרה
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
  const percent = ((currentStepIndex + 1) / totalSteps) * 100;

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.elements.message;
    const text = input.value.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      from: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);

    const replyText = generateBotReply(text, recipe, currentStepIndex);
    const botMsg = {
      id: Date.now() + 1,
      from: "bot",
      text: replyText,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
    }, 200);

    input.value = "";
  };

  return (
    <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Cooking: {recipe.title}
          </h2>
          <p className="text-xs text-gray-500">
            Follow the steps and always ask an adult for help when needed.
          </p>
        </div>
        <button
          onClick={() => navigate("/recipes")}
          className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-gray-200 text-gray-700"
        >
          ⬅ Back to recipes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Steps + safety */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs md:text-sm text-gray-700">
              Step <span>{currentStepIndex + 1}</span> of{" "}
              <span>{totalSteps}</span>
            </div>
            <div className="w-32 md:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                Current step
              </h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {recipe.steps[currentStepIndex]}
              </p>
            </div>
            <div className="w-full md:w-40 h-32 bg-white rounded-2xl shadow-inner flex items-center justify-center text-gray-400 text-xs md:text-sm">
              Step image
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-gray-200 text-gray-700 disabled:opacity-40"
            >
              ⬅ Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40"
            >
              Next step ➡
            </button>
          </div>

          <div className="mt-3">
            <h4 className="text-xs md:text-sm font-semibold text-gray-800 mb-1">
              Safety tips for this recipe
            </h4>
            <ul className="list-disc list-inside text-[11px] md:text-xs text-red-600 space-y-1">
              {recipe.safetyTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat */}
        <aside className="space-y-3">
          <div className="bg-white bg-opacity-90 rounded-3xl shadow p-3 md:p-4 flex flex-col h-64">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm md:text-base font-bold text-gray-800">
                🤖 ChefBot – Session Chat
              </h3>
              <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Online
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-xs md:text-sm pb-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.from === "bot"
                      ? "bg-pink-50 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]"
                      : "bg-purple-50 text-gray-800 px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%] ml-auto"
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>
            <form className="mt-2 flex gap-2" onSubmit={handleSendMessage}>
              <input
                name="message"
                type="text"
                placeholder="Ask ChefBot about this step..."
                className="flex-1 px-2 py-1.5 text-xs md:text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs md:text-sm bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                Send
              </button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
