/**
 * Search input component for recipes
 */
export default function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
        🔍
      </span>
      <input
        type="text"
        placeholder="Search yummy recipes..."
        className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-(--border-color) rounded-full focus:outline-none focus:border-emerald-400 bg-(--input-bg) text-(--text-primary) font-medium transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search recipes"
      />
    </div>
  );
}
