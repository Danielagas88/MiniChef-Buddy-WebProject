import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../../services/recipeService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { usePantryMatching } from "../../hooks/usePantryMatching.js";
import PantryHeader from "./PantryHeader.jsx";
import PantryMatchMode from "./PantryMatchMode.jsx";
import PantryInput from "./PantryInput.jsx";
import PantryChips from "./PantryChips.jsx";
import PantryResults from "./PantryResults.jsx";

export default function PantryHelper() {
  const { user } = useAuth();
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

  const { matchedRecipes, normalizeIngredientLine } = usePantryMatching(
    recipes,
    pantryItems,
    matchMode,
    user?.cookingLevel,
    user?.allergens
  );

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

  return (
    <div className="bg-(--card-surface) backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8 space-y-6 border border-(--card-surface-border) transition-all">
      <PantryHeader />
      <PantryMatchMode matchMode={matchMode} onModeChange={setMatchMode} />

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
