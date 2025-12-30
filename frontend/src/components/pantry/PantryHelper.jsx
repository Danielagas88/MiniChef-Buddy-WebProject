import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../../services/recipeService.js";
import PantryInput from "./PantryInput.jsx";
import PantryChips from "./PantryChips.jsx";
import PantryResults from "./PantryResults.jsx";

export default function PantryHelper() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pantryInput, setPantryInput] = useState("");
  const [pantryItems, setPantryItems] = useState([]);
  const [matchMode, setMatchMode] = useState("any"); // "any" | "all"
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRecipes("");
        if (alive) setRecipes(data);
      } catch {
        if (alive) setError("Failed to load recipes");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  function normalizeIngredientLine(line) {
    return line
      .toLowerCase()
      .replace(/[\d/.]+/g, " ")
      .replace(
        /\b(cup|cups|tbsp|tsp|teaspoon|tablespoon|grams|g|kg|ml|l|oz|lb)\b/g,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();
  }

  function addItem(raw) {
    const item = normalizeIngredientLine(raw);
    if (!item) return;

    setPantryItems((prev) => Array.from(new Set([...prev, item])));
  }

  function addFromInput() {
    addItem(pantryInput);
    setPantryInput("");
  }

  function scanFromInputCommaSeparated() {
    const parts = pantryInput
      .split(",")
      .map(normalizeIngredientLine)
      .filter(Boolean);

    if (parts.length === 0) return;
    setPantryItems((prev) => Array.from(new Set([...prev, ...parts])));
    setPantryInput("");
  }

  function removeItem(item) {
    setPantryItems((prev) => prev.filter((x) => x !== item));
  }

  const matchedRecipes = useMemo(() => {
    if (pantryItems.length === 0) return [];

    return recipes
      .map((r) => {
        const ing = (r.ingredients || []).map(normalizeIngredientLine);

        const hits = pantryItems.filter((p) =>
          ing.some((i) => i.includes(p) || p.includes(i))
        );

        const ok =
          matchMode === "all"
            ? hits.length === pantryItems.length
            : hits.length > 0;

        return ok ? { recipe: r, hitsCount: hits.length, hits } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.hitsCount - a.hitsCount);
  }, [recipes, pantryItems, matchMode]);

  return (
    <div className="bg-white bg-opacity-80 rounded-3xl shadow p-4 md:p-6 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Pantry helper</h4>
          <p className="text-gray-600 mb-2 text-sm">
            Add ingredients you have at home and we’ll suggest recipes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Match:</span>
          <select
            value={matchMode}
            onChange={(e) => setMatchMode(e.target.value)}
            className="text-xs px-2 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="any">Any ingredient</option>
            <option value="all">All ingredients</option>
          </select>
        </div>
      </div>

      <PantryInput
        value={pantryInput}
        onChange={setPantryInput}
        onAdd={addFromInput}
        onScan={scanFromInputCommaSeparated}
      />

      {loading && <p className="text-xs text-gray-600">Loading recipes…</p>}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <PantryChips
        items={pantryItems}
        onRemove={removeItem}
        onClear={() => setPantryItems([])}
      />

      <PantryResults
        pantryItems={pantryItems}
        results={matchedRecipes}
        onStart={(id) => navigate(`/session/${id}`)}
      />
    </div>
  );
}
