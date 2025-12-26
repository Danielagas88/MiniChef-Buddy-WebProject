export default function PantryInput({ value, onChange, onAdd, onScan }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="e.g. eggs, milk, banana..."
        className="flex-1 min-w-[160px] px-3 py-1.5 border border-gray-300 rounded-full text-xs md:text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
          }
        }}
      />
      <button
        onClick={onAdd}
        className="px-3 py-1.5 text-xs md:text-sm bg-yellow-400 rounded-full hover:bg-yellow-500"
      >
        Add item
      </button>
      <button
        onClick={onScan}
        className="px-3 py-1.5 text-xs md:text-sm bg-purple-400 text-white rounded-full hover:bg-purple-500"
        title="Demo scan: type items separated by commas and click"
      >
        Scan pantry
      </button>
    </div>
  );
}
