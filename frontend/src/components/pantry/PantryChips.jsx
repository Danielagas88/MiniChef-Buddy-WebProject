export default function PantryChips({ items, onRemove, onClear }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onRemove(item)}
          /* Changed from Pink to Emerald (Mint) theme */
          /* Added a subtle hover effect that turns red to indicate "Remove" */
          className="group px-4 py-1.5 text-sm font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-2"
          title="Remove item"
        >
          {item}
          {/* The X icon gets bolder on hover */}
          <span className="text-emerald-500 group-hover:text-red-500 font-bold text-xs">
            ✕
          </span>
        </button>
      ))}

      <button
        onClick={onClear}
        /* Styling the Clear button with Slate and Amber hover */
        className="px-4 py-1.5 text-sm font-bold rounded-full bg-slate-100 text-slate-500 border border-transparent hover:bg-amber-100 hover:text-amber-700 hover:border-amber-200 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
