export default function BadgeCard({
  IconComponent,
  title,
  unlocked,
  subtitle,
}) {
  const Icon = IconComponent;

  return (
    <div
      className={`rounded-3xl border-2 p-4 text-center transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
        unlocked
          ? "bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30 shadow-sm scale-100"
          : "bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 opacity-60 scale-95"
      }`}
    >
      {/* Sparkle effect for unlocked badges */}
      {unlocked && (
        <div className="absolute -top-1 -right-1 text-amber-400 animate-pulse">
          ✨
        </div>
      )}

      <div
        className={`mx-auto mb-3 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
          unlocked
            ? "bg-amber-400 text-white shadow-lg rotate-3"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {Icon ? (
          <Icon
            className={`${unlocked ? "w-6 h-6 stroke-[2.5px]" : "w-5 h-5"}`}
          />
        ) : (
          <span className="text-xl italic">?</span>
        )}
      </div>

      <div
        className={`text-xs md:text-sm font-black tracking-tight ${
          unlocked
            ? "text-[var(--text-primary)]"
            : "text-[var(--text-secondary)]"
        }`}
      >
        {title}
      </div>

      <div
        className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${
          unlocked ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {unlocked ? "Unlocked 🎉" : subtitle || "Locked"}
      </div>
    </div>
  );
}
