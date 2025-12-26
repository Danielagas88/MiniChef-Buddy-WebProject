import RecipeCard from "../recipes/RecipeCard.jsx";

export default function PantryResults({ pantryItems, results, onStart }) {
  if (!pantryItems || pantryItems.length === 0) return null;

  return (
    <div className="pt-3">
      <h5 className="text-sm font-semibold text-gray-800 mb-2">
        Suggested recipes
      </h5>

      {results.length === 0 ? (
        <p className="text-sm text-gray-600">
          No matching recipes yet. Try different ingredients.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {results.map(({ recipe, hitsCount, hits }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onOpen={() => onStart(recipe.id)} // או navigate(`/session/${id}`)
              badge={`match ${hitsCount}`}
              subtitleExtra={
                <>
                  Matched:{" "}
                  <span className="font-medium">{hits.join(", ")}</span>
                </>
              }
              imageHeightClass="h-28"
              footer={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart(recipe.id);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-full bg-pink-500 text-white hover:bg-pink-600"
                >
                  Start cooking
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
