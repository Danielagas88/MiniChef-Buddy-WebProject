import { memo } from "react";

function SessionHeader({ title, onBack, isVoiceEnabled, onToggleVoice }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap bg-(--card-surface) backdrop-blur-md p-4 rounded-3xl border border-(--card-surface-border) shadow-sm transition-all">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl md:text-3xl font-extrabold text-(--text-primary) tracking-tight">
          Cooking: <span className="text-(--accent-emerald)">{title}</span>
        </h2>

        <p className="text-xs md:text-sm text-(--text-secondary) font-medium flex items-center gap-1">
          <span className="text-amber-500">⭐</span>
          Follow the steps and always ask an adult for help.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleVoice}
          type="button"
          className={`p-2.5 rounded-full transition-all duration-300 border backdrop-blur-sm shadow-sm active:scale-90 ${
            isVoiceEnabled
              ? "bg-emerald-500/10 text-(--accent-emerald) border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-(--input-bg) text-(--muted) border-(--border-color) hover:opacity-80"
          }`}
          title={isVoiceEnabled ? "Mute All" : "Enable Sound"}
        >
          <span className="text-lg">{isVoiceEnabled ? "🔊" : "🔇"}</span>
        </button>

        <button
          onClick={onBack}
          className="group flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-full bg-(--input-bg) border border-(--border-color) text-(--text-primary) hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm"
        >
          Back to Recipes
        </button>
      </div>
    </div>
  );
}
export default memo(SessionHeader);
