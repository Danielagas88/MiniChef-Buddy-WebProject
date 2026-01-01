export default function RecipeCard({
  recipe,
  onOpen,
  action,
  footer,
  badge,
  subtitleExtra,
  imageHeightClass = "h-48",
}) {
  return (
    <article
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-emerald-50 cursor-pointer hover:-translate-y-1"
      onClick={onOpen}
    >
      {/* Top-right action (Like button / heart) */}
      {action && (
        <div className="absolute top-3 right-3 z-20 transform transition-transform group-hover:scale-110">
          {action}
        </div>
      )}

      {/* Recipe Image with Overlay on Hover */}
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className={`w-full ${imageHeightClass} object-cover transition-transform duration-500 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base md:text-lg font-extrabold text-slate-800 leading-tight">
            {recipe.title}
          </h4>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        {/* Level & Time with Icons */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">📊</span> {recipe.level}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-500">🕒</span> {recipe.time}
          </span>
        </div>

        {subtitleExtra && (
          <p className="text-xs text-emerald-600 font-medium italic">
            {subtitleExtra}
          </p>
        )}

        {/* Tags with Emerald Theme */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {recipe.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom action area */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-slate-50">{footer}</div>
        )}
      </div>
    </article>
  );
}
