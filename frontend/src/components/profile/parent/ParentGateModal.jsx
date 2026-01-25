export default function ParentGateModal({
  pin,
  pinMode,
  setPinInput,
  setPinConfirm,
  onClose,
  onSubmit,
  onForgotPin,
}) {
  const isSetup = pinMode === "setup" || pinMode === "create";

  return (
    <div
      className="w-full max-w-[360px] bg-linear-to-br from-white/90 to-white/60 dark:from-white/15 dark:to-white/5 backdrop-blur-2xl rounded-[3rem] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-8 border border-white/80 dark:border-white/20 relative overflow-hidden transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {/* בועות ניאון - כמו ב-FinishModal */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 space-y-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm backdrop-blur-md border border-white/20 ${
            isSetup
              ? "bg-amber-100/50 dark:bg-amber-500/20 text-amber-600"
              : "bg-emerald-100/50 dark:bg-emerald-500/20 text-emerald-600"
          }`}
        >
          {isSetup ? "🔑" : "🔒"}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-(--text-primary) tracking-tight">
            {isSetup ? "Set Secret PIN" : "Parents Only"}
          </h2>
          <p className="text-sm text-(--text-primary) opacity-70 font-medium">
            {isSetup ? "Create a 4-digit PIN" : "Enter your PIN to continue"}
          </p>
        </div>

        <div className="space-y-4 py-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin.input}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="••••"
            className="w-full text-center text-4xl tracking-[0.4em] font-black text-(--text-primary) border-b-2 border-slate-200/50 dark:border-white/10 focus:border-emerald-500 focus:outline-none py-2 bg-transparent transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
            autoFocus
          />
          {isSetup && (
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin.confirm}
              onChange={(e) => setPinConfirm(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-4xl tracking-[0.4em] font-black text-(--text-primary) border-b-2 border-slate-200/50 dark:border-white/10 focus:border-amber-500 focus:outline-none py-2 bg-transparent transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl bg-white/40 dark:bg-white/5 px-4 py-4 text-sm font-black text-(--text-primary) border border-white/40 hover:bg-white/60 dark:hover:bg-white/10 transition-all active:scale-95"
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            disabled={
              pin.input.length !== 4 || (isSetup && pin.confirm.length !== 4)
            }
            className="flex-1 rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 disabled:opacity-30 transition-all active:scale-95"
          >
            {isSetup ? "Save" : "Unlock"}
          </button>
        </div>

        {!isSetup && (
          <button
            onClick={onForgotPin}
            className="text-[10px] font-black text-(--text-primary) opacity-40 hover:opacity-100 hover:text-emerald-500 transition-all uppercase tracking-[0.2em] pt-2"
          >
            Forgot PIN?
          </button>
        )}
      </div>
    </div>
  );
}
