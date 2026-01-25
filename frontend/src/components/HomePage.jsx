import PantryHelper from "./pantry/PantryHelper.jsx";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center border border-(--card-surface-border) transition-all">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-(--text-primary) leading-tight">
            Welcome to the{" "}
            <span className="text-(--accent-emerald)">MiniChef Buddy</span>{" "}
            Kitchen
          </h2>
          <p className="text-sm md:text-base text-(--text-secondary) leading-relaxed font-medium">
            MiniChef Buddy is an interactive web app for kids who want to learn
            how to cook in a fun, safe and playful way. A friendly AI chatbot
            guides the child through each recipe step-by-step.
          </p>
        </div>

        <div className="mt-6">
          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-tr from-emerald-300 to-amber-300 rounded-full shadow-inner flex items-center justify-center animate-pulse-slow">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-(--bg-current) rounded-full shadow flex flex-col items-center justify-center border-2 border-(--border-color)">
              <div className="text-3xl md:text-4xl">🤖</div>
              <p className="text-[8px] md:text-[10px] font-bold text-(--accent-emerald) uppercase tracking-tighter">
                ChefBuddy
              </p>
            </div>
          </div>
        </div>
      </div>

      <PantryHelper />
    </section>
  );
}
