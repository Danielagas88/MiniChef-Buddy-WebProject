/**
 * Match mode selector component
 */
export default function PantryMatchMode({ matchMode, onModeChange }) {
  return (
    <div className="flex justify-center items-center gap-3">
      <span className="text-sm font-medium text-(--text-secondary)">
        Match mode:
      </span>
      <select
        value={matchMode}
        onChange={(e) => onModeChange(e.target.value)}
        className="text-sm px-4 py-2 border-2 border-(--border-color) rounded-full bg-(--input-bg) text-(--text-primary) font-semibold cursor-pointer"
        aria-label="Select match mode"
      >
        <option value="any">Any ingredient</option>
        <option value="all">All ingredients</option>
      </select>
    </div>
  );
}
