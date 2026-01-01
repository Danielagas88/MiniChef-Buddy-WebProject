import PantryHelper from "./pantry/PantryHelper.jsx";

export default function HomePage() {
  return (
    <section className="space-y-6">
      {/* 1. HERO SECTION - Centered Layout */}
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center border border-emerald-50">
        {/* Full Description Stays Here */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
            Welcome to the{" "}
            <span className="text-emerald-600">MiniChef Buddy</span> Kitchen
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
            MiniChef Buddy is an interactive web app for kids who want to learn
            how to cook in a fun, safe and playful way. A friendly AI chatbot
            guides the child through each recipe step-by-step.
          </p>
        </div>

        {/* 2. COMPACT ROBOT - Positioned below text, centered */}
        <div className="mt-6">
          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-tr from-emerald-300 to-amber-300 rounded-full shadow-inner flex items-center justify-center animate-pulse-slow">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow flex flex-col items-center justify-center border-2 border-white">
              <div className="text-3xl md:text-4xl">🤖</div>
              <p className="text-[8px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                ChefBuddy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PANTRY HELPER SECTION */}
      <PantryHelper />
    </section>
  );
}
