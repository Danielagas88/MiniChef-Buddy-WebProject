/**
 * Level filter dropdown component
 */
export default function LevelFilter({ value, onChange, levelOptions = ["Easy", "Medium", "Advanced"] }) {
  return (
    <div className="relative">
      <select
        className="appearance-none pl-4 pr-10 py-2.5 text-sm font-bold border-2 border-(--border-color) rounded-full focus:outline-none focus:border-amber-400 bg-(--input-bg) text-(--text-primary) cursor-pointer transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by cooking level"
      >
        <option value="" className="bg-(--input-bg) text-(--text-primary)">
          All Levels
        </option>
        {levelOptions.map((lvl) => (
          <option key={lvl} value={lvl} className="bg-(--input-bg) text-(--text-primary)">
            {lvl}
          </option>
        ))}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-(--muted)">
        ▼
      </span>
    </div>
  );
}
