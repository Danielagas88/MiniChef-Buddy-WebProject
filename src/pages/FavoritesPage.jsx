export default function FavoritesPage() {
  return (
    <section className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
      <h2 className="text-xl font-bold text-gray-800">⭐ My Favorites</h2>
      <p className="text-sm text-gray-700 mb-2">
        Here you can see a list of favorite recipes. In a full version, this
        list is personalized for each child.
      </p>
      <ul className="text-sm text-gray-800 space-y-1">
        <li>• Happy Pancakes</li>
        <li>• Rainbow Salad</li>
        <li>• Choco Banana Shake</li>
      </ul>
    </section>
  );
}
