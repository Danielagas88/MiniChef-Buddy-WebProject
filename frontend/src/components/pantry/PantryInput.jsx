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
          className="w-full pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-emerald-100 dark:border-white/20 
                     bg-white/90 dark:bg-white/10 backdrop-blur-md
                     focus:border-amber-400 focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/20 outline-none
                     shadow-md transition-all duration-300 
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     text-[var(--text-primary)]"
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
          className="flex-1 md:flex-none px-6 py-3 text-sm font-bold bg-amber-400 text-slate-900 rounded-2xl hover:bg-amber-500 shadow-md dark:shadow-amber-900/20 transition-all active:scale-95 whitespace-nowrap"
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
