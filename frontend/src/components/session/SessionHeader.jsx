export default function SessionHeader({ title, onBack }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/60 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Cooking: <span className="text-emerald-600">{title}</span>
        </h2>

        <p className="text-xs md:text-sm text-slate-500 font-medium flex items-center gap-1">
          <span className="text-amber-500">⭐</span>
          Follow the steps and always ask an adult for help.
        </p>
      </div>

      <button
        onClick={onBack}
        className="group flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-full bg-slate-800 text-white hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-emerald-200"
      >
        <span className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        Back to recipes
      </button>
    </div>
  );
}
