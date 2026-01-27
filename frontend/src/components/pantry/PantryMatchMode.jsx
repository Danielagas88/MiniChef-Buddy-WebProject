/**
 * PantryMatchMode
 *
 * Match mode selector: "Any ingredient" or "All ingredients". Controls how
 * recipes are matched to the user's pantry list. Used in PantryHelper.
 *
 * @param {Object} props
 * @param {string} props.matchMode - "any" or "all"
 * @param {Function} props.onModeChange - Called when mode changes
 *
 * @component
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
