export default function PantryChips({ items, onRemove, onClear }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onRemove(item)}
          className="px-3 py-1 text-xs rounded-full bg-pink-50 text-pink-700 border border-pink-100 hover:bg-pink-100"
          title="Remove"
        >
          {item} ✕
        </button>
      ))}
      <button
        onClick={onClear}
        className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Clear
      </button>
    </div>
  );
}
