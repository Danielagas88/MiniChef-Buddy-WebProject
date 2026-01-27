/**
 * RecipeCard
 *
 * Card for a single recipe: image, title, optional action, footer, badge.
 * Used in recipes list and favorites.
 *
 * @param {Object} props
 * @param {Object} props.recipe - Recipe object (title, image, level, etc.)
 * @param {Function} props.onOpen - Called when card is clicked
 * @param {React.ReactNode} [props.action] - Optional action button
 * @param {React.ReactNode} [props.footer] - Optional footer content
 * @param {React.ReactNode} [props.badge] - Optional badge
 * @param {React.ReactNode} [props.subtitleExtra] - Optional extra subtitle
 * @param {string} [props.imageHeightClass="h-48"] - Tailwind class for image height
 *
 * @component
 */
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
      className="group relative bg-(--card-surface) backdrop-blur-md rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-(--card-surface-border) cursor-pointer"
      onClick={onOpen}
    >
      {action && (
        <div className="absolute top-3 right-3 z-20 transform transition-transform group-hover:scale-110">
          {action}
        </div>
      )}

      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className={`w-full ${imageHeightClass} object-cover transition-transform duration-500 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm md:text-lg font-extrabold text-(--text-primary) leading-tight line-clamp-1">
            {recipe.title}
          </h4>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px] md:text-xs font-semibold text-(--text-secondary)">
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">📊</span> {recipe.level}
          </span>
        </div>

        {subtitleExtra && (
          <p className="text-xs text-(--accent-emerald) font-medium italic">
            {subtitleExtra}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2">
          {recipe.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold bg-emerald-500/10 text-(--accent-emerald) rounded-full border border-emerald-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>

        {footer && (
          <div className="mt-4 pt-4 border-t border-(--border-color)">{footer}</div>
        )}
      </div>
    </article>
  );
}
