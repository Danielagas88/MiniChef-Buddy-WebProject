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
  const [matchMode, setMatchMode] = useState("any");
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
        " ",
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
          ing.some((i) => i.includes(p) || p.includes(i)),
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
    <div className="bg-(--card-surface) backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8 space-y-6 border border-(--card-surface-border) transition-all">
      <div className="text-center space-y-1 mb-4">
        <h4 className="text-2xl font-bold text-(--text-primary) flex items-center justify-center gap-2">
          Pantry Helper
        </h4>
        <p className="text-(--text-secondary) text-sm md:text-base font-medium">
          Add ingredients you have at home and we'll suggest yummy recipes for
          you!
        </p>
      </div>

      <div className="flex justify-center items-center gap-3">
        <span className="text-sm font-medium text-(--text-secondary)">
          Match mode:
        </span>
        <select
          value={matchMode}
          onChange={(e) => setMatchMode(e.target.value)}
          className="text-sm px-4 py-2 border-2 border-(--border-color) rounded-full bg-(--input-bg) text-(--text-primary) font-semibold cursor-pointer"
        >
          <option value="any">Any ingredient</option>
          <option value="all">All ingredients</option>
        </select>
      </div>

      <PantryInput
        value={pantryInput}
        onChange={setPantryInput}
        onAdd={addFromInput}
        onScan={scanFromInputCommaSeparated}
      />

      {loading && (
        <p className="text-center text-sm text-(--text-secondary) animate-pulse">
          Loading recipes...
        </p>
      )}

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

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
