export default function Brand({ onClick }) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer group select-none antialiased"
      onClick={onClick}
    >
      <div className="w-10 h-10 flex-shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
        🍳
      </div>

      {/* Text container */}
      <div className="flex flex-col min-w-[120px]">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-none transition-colors">
          <span className="text-emerald-600 dark:text-emerald-400">
            MiniChef
          </span>{" "}
          <span className="text-[var(--text-primary)]">Buddy</span>
        </h1>
        <p className="text-[11px] text-[var(--text-secondary)] font-bold tracking-wide transition-colors">
          Cooking adventures for kids!
        </p>
      </div>
    </div>
  );
}
