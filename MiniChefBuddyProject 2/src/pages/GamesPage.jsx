import { games } from "../data/fakeData.js";

export default function GamesPage() {
  return (
    <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
      <h2 className="text-xl font-bold text-gray-800">Learning Games</h2>
      <p className="text-sm text-gray-700">
        MiniChef Buddy includes short learning games to teach kids about kitchen
        safety, ingredients and recipe order in a playful way.
      </p>
    </section>
  );
}
