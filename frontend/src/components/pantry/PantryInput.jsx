export default function PantryInput({ value, onChange, onAdd, onScan }) {
  return (
    /* Main container: centered with a maximum width to keep it elegant */
    <div className="flex flex-col md:flex-row gap-3 items-center max-w-3xl mx-auto w-full">
      <div className="relative flex-1 w-full group">
        {/* Search icon for better visual presence */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-emerald-500 group-focus-within:text-amber-500 transition-colors">
          🔍
        </span>

        <input
          type="text"
          placeholder="e.g. eggs, milk, banana..."
          /* Increased padding and font size, with new emerald/amber theme */
          className="w-full pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-emerald-100 
                     focus:border-amber-400 focus:ring-4 focus:ring-amber-50 outline-none
                     shadow-md transition-all duration-300 placeholder:text-slate-300"
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

      {/* Action Buttons: Unified with the new color palette */}
      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={onAdd}
          /* Using Amber-400 for 'Add' action */
          className="flex-1 md:flex-none px-6 py-3 text-sm font-bold bg-amber-400 text-slate-800 rounded-2xl hover:bg-amber-500 shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          Add item
        </button>
        <button
          onClick={onScan}
          /* Using Emerald-500 for 'Scan' action */
          className="flex-1 md:flex-none px-6 py-3 text-sm font-bold bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-md transition-all active:scale-95 whitespace-nowrap"
          title="Demo scan: type items separated by commas and click"
        >
          Scan pantry
        </button>
      </div>
    </div>
  );
}
