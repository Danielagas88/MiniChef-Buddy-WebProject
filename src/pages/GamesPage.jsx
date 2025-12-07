import { games } from "../data/fakeData.js";

export default function GamesPage() {
  return (
    <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
      <h2 className="text-xl font-bold text-gray-800">🎮 Learning Games</h2>
      <p className="text-sm text-gray-700">
        MiniChef Buddy includes short learning games to teach kids about kitchen
        safety, ingredients and recipe order in a playful way.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-yellow-50 rounded-2xl p-3 shadow-sm flex flex-col"
          >
            <h3 className="font-semibold text-gray-800 mb-1">{game.title}</h3>
            <p className="text-xs text-gray-600 flex-1">{game.description}</p>
            <p className="text-[11px] text-gray-500 mt-2">
              Level: <span className="font-medium">{game.level}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
