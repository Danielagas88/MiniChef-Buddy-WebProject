/**
 * PantryInput
 *
 * Input area for adding pantry ingredients: text field, "Add item" and
 * "Scan pantry" buttons. Enter key triggers add. Used in PantryHelper.
 *
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Called when input value changes
 * @param {Function} props.onAdd - Called when adding the current item
 * @param {Function} props.onScan - Called for "Scan pantry" (demo: parse comma-separated)
 *
 * @component
 */
export default function PantryInput({ value, onChange, onAdd, onScan }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center max-w-3xl mx-auto w-full">
      <div className="relative flex-1 w-full group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-emerald-500 group-focus-within:text-amber-500 transition-colors">
          🔍
        </span>

        <input
          type="text"
          placeholder="e.g. eggs, milk, banana..."
          className="w-full pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-(--border-color) bg-(--input-bg) focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 outline-none shadow-md transition-all duration-300 placeholder:text-(--muted) text-(--text-primary)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={onAdd}
          className="flex-1 md:flex-none px-6 py-3 text-sm font-bold bg-amber-400 text-slate-900 rounded-2xl hover:bg-amber-500 shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          Add item
        </button>
        <button
          onClick={onScan}
          className="flex-1 md:flex-none px-6 py-3 text-sm font-bold bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-md transition-all active:scale-95 whitespace-nowrap"
          title="Demo scan: type items separated by commas and click"
        >
          Scan pantry
        </button>
      </div>
    </div>
  );
}
