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
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[350px] rounded-[2.5rem] bg-white p-8 shadow-2xl text-center space-y-6 border border-emerald-50 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-50 rounded-full blur-3xl opacity-60"></div>

        <div
          className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mx-auto text-3xl shadow-sm ${
            isSetup
              ? "bg-amber-100 text-amber-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {isSetup ? "🔑" : "🔒"}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {isSetup ? "Set Secret PIN" : "Parents Only"}
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">
            {isSetup
              ? "Create a 4-digit PIN to keep things safe."
              : "Enter your PIN to continue to the dashboard."}
          </p>
        </div>

        <div className="space-y-5 py-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin.input}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={isSetup ? "New PIN" : "••••"}
            className="w-full text-center text-3xl tracking-[0.5em] font-black text-slate-800 border-b-2 border-slate-100 focus:border-emerald-500 focus:outline-none py-2 bg-transparent transition-colors placeholder:text-slate-200"
            autoFocus
          />

          {isSetup && (
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin.confirm}
              onChange={(e) => setPinConfirm(e.target.value)}
              placeholder="Confirm"
              className="w-full text-center text-3xl tracking-[0.5em] font-black text-slate-800 border-b-2 border-slate-100 focus:border-amber-500 focus:outline-none py-2 bg-transparent transition-colors placeholder:text-slate-200"
            />
          )}
        </div>

        {pin.error && (
          <div className="text-xs font-bold text-red-500 bg-red-50 py-2 rounded-lg animate-pulse">
            ⚠️ {pin.error}
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl bg-slate-50 px-4 py-3.5 text-sm font-black text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
          >
            Back
          </button>

          <button
            onClick={onSubmit}
            disabled={
              pin.input.length !== 4 || (isSetup && pin.confirm.length !== 4)
            }
            className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600 disabled:opacity-30 transition-all active:scale-95"
          >
            {isSetup ? "Save" : "Unlock"}
          </button>
        </div>

        {!isSetup && (
          <button
            onClick={onForgotPin}
            className="text-xs font-bold text-slate-300 hover:text-emerald-600 transition-colors uppercase tracking-widest pt-2"
          >
            Forgot PIN?
          </button>
        )}
      </div>
    </div>
  );
}
