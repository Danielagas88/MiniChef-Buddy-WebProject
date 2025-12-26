export default function RecipeCard({
  recipe,
  onOpen, // לחיצה על הכרטיס
  action, // אלמנט בצד ימין למעלה (למשל לב)
  footer, // אלמנט בתחתית הכרטיס (למשל Start cooking)
  badge, // תגית קטנה ליד הכותרת (למשל match 2)
  subtitleExtra, // טקסט נוסף מתחת לשורה של level/time (למשל "Matched: ...")
  imageHeightClass = "h-36",
}) {
  return (
    <article
      className="relative bg-white bg-opacity-90 rounded-2xl shadow hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden"
      onClick={onOpen}
    >
      {/* top-right action (favorite etc.) */}
      {action && <div className="absolute top-2 right-2 z-10">{action}</div>}

      <img
        src={recipe.image}
        alt={recipe.title}
        className={`w-full ${imageHeightClass} object-cover`}
      />

      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-1">
            {recipe.title}
          </h4>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-500 mb-2">
          Level: <span className="font-medium">{recipe.level}</span> · Time:{" "}
          {recipe.time}
        </p>

        {subtitleExtra && (
          <p className="text-[11px] text-gray-600 mb-2">{subtitleExtra}</p>
        )}

        <div className="flex flex-wrap gap-1 mt-auto">
          {recipe.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] bg-pink-50 text-pink-600 rounded-full border border-pink-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* bottom action area (Start cooking etc.) */}
        {footer && <div className="pt-3">{footer}</div>}
      </div>
    </article>
  );
}
