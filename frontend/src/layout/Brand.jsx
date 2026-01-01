export default function Brand({ onClick }) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform duration-300">
        🍳
      </div>

      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
          <span className="text-emerald-600">MiniChef</span> Buddy
        </h1>
        <p className="text-[11px] text-slate-500 font-medium">
          Cooking adventures for kids!
        </p>
      </div>
    </div>
  );
}
