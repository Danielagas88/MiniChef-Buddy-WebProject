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
      className="w-full max-w-[360px] bg-(--card-surface) backdrop-blur-2xl rounded-[3rem] p-10 text-center shadow-xl space-y-8 border border-(--card-surface-border) relative overflow-hidden transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 space-y-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm backdrop-blur-md border border-(--border-color) ${
            isSetup
              ? "bg-amber-500/10 text-(--accent-amber)"
              : "bg-emerald-500/10 text-(--accent-emerald)"
          }`}
        >
          {isSetup ? "🔑" : "🔒"}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-(--text-primary) tracking-tight">
            {isSetup ? "Set Secret PIN" : "Parents Only"}
          </h2>
          <p className="text-sm text-(--text-secondary) font-medium">
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
            className="w-full text-center text-4xl tracking-[0.4em] font-black text-(--text-primary) border-b-2 border-(--border-color) focus:border-emerald-500 focus:outline-none py-2 bg-transparent transition-all placeholder:text-(--muted)"
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
              className="w-full text-center text-4xl tracking-[0.4em] font-black text-(--text-primary) border-b-2 border-(--border-color) focus:border-amber-500 focus:outline-none py-2 bg-transparent transition-all placeholder:text-(--muted)"
            />
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl bg-(--input-bg) px-4 py-4 text-sm font-black text-(--text-primary) border border-(--border-color) hover:opacity-90 transition-all active:scale-95"
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
            className="text-[10px] font-black text-(--text-secondary) opacity-70 hover:opacity-100 hover:text-(--accent-emerald) transition-all uppercase tracking-[0.2em] pt-2"
          >
            Forgot PIN?
          </button>
        )}
      </div>
    </div>
  );
}
