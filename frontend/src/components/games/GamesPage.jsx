import { Rocket, Gamepad2, Timer, Lock } from "lucide-react";

export default function GamesPage() {
  return (
    <section className="space-y-6 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm p-8 border border-emerald-50 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 shadow-inner">
            <Gamepad2 size={40} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Learning <span className="text-emerald-600">Games</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl">
              Master your kitchen skills through playful challenges! From
              ingredient matching to safety puzzles, learning to cook has never
              been this fun.
            </p>
          </div>
        </div>
      </div>

      {/* "Coming Soon" Hero Area */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-center border-4 border-emerald-500/20 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 animate-bounce">
            <Rocket size={14} /> Launching Soon
          </div>

          <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
            The Culinary Arcade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
              Is Under Construction
            </span>
          </h3>

          <p className="text-slate-400 font-medium max-w-lg mx-auto text-lg">
            Our chefs are busy coding new adventures. Get ready for kitchen
            safety quests and ingredient puzzles!
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-sm group hover:bg-white/10 transition-colors">
              <Lock
                className="mx-auto mb-2 text-slate-500 group-hover:text-amber-400 transition-colors"
                size={24}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
