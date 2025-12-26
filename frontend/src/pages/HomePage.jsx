import PantryHelper from "../components/pantry/PantryHelper.jsx";

export default function HomePage() {
  return (
    <section className="space-y-4">
      {/* HERO */}
      <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Welcome to the MiniChef Buddy Kitchen 👩‍🍳
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            MiniChef Buddy is an interactive web app for kids who want to learn
            how to cook in a fun, safe and playful way. A friendly AI chatbot
            guides the child through each recipe step-by-step, explains
            instructions, warns about dangers, and encourages creativity in the
            kitchen.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-40 h-40 md:w-56 md:h-56 bg-linear-to-tr from-pink-300 to-yellow-300 rounded-full shadow-inner flex items-center justify-center">
            <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-full shadow flex flex-col items-center justify-center">
              <div className="text-4xl md:text-5xl">🤖</div>
              <p className="text-xs md:text-sm font-semibold text-gray-700 mt-1">
                ChefBuddy
              </p>
              <p className="text-[10px] md:text-xs text-gray-500">
                your smart kitchen friend
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PANTRY HELPER */}
      <PantryHelper />
    </section>
  );
}
