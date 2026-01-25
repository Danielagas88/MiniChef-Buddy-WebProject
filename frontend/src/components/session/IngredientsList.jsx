/* IngredientsList.jsx */
import { memo } from "react";

function IngredientsList({ ingredients }) {
  return (
    <div className="lg:col-span-1 bg-(--card-surface) backdrop-blur-md rounded-3xl border-2 border-(--card-surface-border) p-6 shadow-sm h-full max-h-[650px] overflow-y-auto transition-all custom-scrollbar">
      <div className="pb-4 mb-4 border-b border-(--border-color)">
        <h3 className="font-bold text-(--accent-amber) text-xl flex items-center gap-2">
          🛒 Ingredients
        </h3>
      </div>

      <ul className="space-y-3">
        {ingredients.map((ing, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 bg-(--input-bg) p-3 rounded-xl border border-(--border-color) shadow-sm transition-all hover:translate-x-1"
          >
            <span className="w-2 h-2 mt-2 bg-amber-400 rounded-full shrink-0 shadow-sm" />
            <span className="text-sm leading-snug text-(--text-primary) font-bold">
              {ing}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(IngredientsList);
