/**
 * PantryHeader
 *
 * Header for the Pantry Helper section on the home page. Shows title and
 * short description for ingredient-based recipe suggestions.
 *
 * @component
 */
export default function PantryHeader() {
  return (
    <div className="text-center space-y-1 mb-4">
      <h4 className="text-2xl font-bold text-(--text-primary) flex items-center justify-center gap-2">
        Pantry Helper
      </h4>
      <p className="text-(--text-secondary) text-sm md:text-base font-medium">
        Add ingredients you have at home and we'll suggest yummy recipes for
        you!
      </p>
    </div>
  );
}
