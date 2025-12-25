import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "../../data/fakeData.js";
import PantryInput from "./PantryInput.jsx";
import PantryChips from "./PantryChips.jsx";
import PantryResults from "./PantryResults.jsx";

export default function PantryHelper() {
  const [pantryInput, setPantryInput] = useState("");
  const [pantryItems, setPantryItems] = useState([]);
  const [matchMode, setMatchMode] = useState("any"); // "any" | "all"
  const navigate = useNavigate();

  function normalizeItem(s) {
    return s.trim().toLowerCase();
  }

  function addItem(raw) {
    const item = normalizeItem(raw);
    if (!item) return;

    setPantryItems((prev) => Array.from(new Set([...prev, item])));
  }

  function addFromInput() {
    addItem(pantryInput);
    setPantryInput("");
  }

  function scanFromInputCommaSeparated() {
    const parts = pantryInput.split(",").map(normalizeItem).filter(Boolean);

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
        const ing = (r.ingredients || []).map(normalizeItem);

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
  }, [pantryItems, matchMode]);

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
