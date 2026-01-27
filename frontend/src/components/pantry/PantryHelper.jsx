/**
 * PantryHelper 
 *
 * Pantry-based recipe finder UI: layout, composition, and wiring of
 * usePantryHelper. All state, loading, matching, and add/remove logic
 * live in usePantryHelper.
 *
 * @component
 */
import { usePantryHelper } from "../../hooks/usePantryHelper.js";
import PantryHeader from "./PantryHeader.jsx";
import PantryMatchMode from "./PantryMatchMode.jsx";
import PantryInput from "./PantryInput.jsx";
import PantryChips from "./PantryChips.jsx";
import PantryResults from "./PantryResults.jsx";

export default function PantryHelper() {
  const {
    pantryInput,
    setPantryInput,
    pantryItems,
    matchMode,
    setMatchMode,
    loading,
    error,
    matchedRecipes,
    addFromInput,
    scanFromInputCommaSeparated,
    removeItem,
    clearItems,
    navigate,
  } = usePantryHelper();

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
        onClear={clearItems}
      />

      <PantryResults
        pantryItems={pantryItems}
        results={matchedRecipes}
        onStart={(id) => navigate(`/session/${id}`)}
      />
    </div>
  );
}
