export default function BadgeCard({
  IconComponent,
  title,
  unlocked,
  subtitle,
}) {
  const Icon = IconComponent;

  return (
    <div
      className={`rounded-2xl border p-4 text-center transition ${
        unlocked
          ? "bg-yellow-50 border-yellow-300"
          : "bg-gray-50 border-gray-200 opacity-70"
      }`}
    >
      <div
        className={`mx-auto mb-2 w-14 h-14 rounded-2xl flex items-center justify-center ${
          unlocked
            ? "bg-yellow-200 text-yellow-800"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {Icon ? (
          <Icon className="w-7 h-7" />
        ) : (
          <span className="text-xl">🏷️</span>
        )}
      </div>

      <div className="font-bold">{title}</div>
      <div className="text-xs text-gray-500 mt-1">
        {unlocked ? "Unlocked 🎉" : subtitle || "Locked"}
      </div>
    </div>
  );
}
