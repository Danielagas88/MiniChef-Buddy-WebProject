export default function PantryRecipeCard({ recipe, hitsCount, hits, onStart }) {
  return (
    <article className="bg-white bg-opacity-90 rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-28 object-cover"
      />

      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-800">
            {recipe.title}
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
            match {hitsCount}
          </span>
        </div>

        <p className="text-[11px] text-gray-500 mb-2">
          Level: <span className="font-medium">{recipe.level}</span> · Time:{" "}
          {recipe.time}
        </p>

        <p className="text-[11px] text-gray-600 mb-2">
          Matched: <span className="font-medium">{hits.join(", ")}</span>
        </p>

        <button
          onClick={onStart}
          className="mt-auto px-3 py-1.5 text-xs rounded-full bg-pink-500 text-white hover:bg-pink-600"
        >
          Start cooking
        </button>
      </div>
    </article>
  );
}
