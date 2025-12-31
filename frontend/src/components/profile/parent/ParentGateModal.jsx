/**
 * ParentGateModal.jsx
 * -------------------
 * PIN gate modal for Parent Area.
 *
 * Modes:
 * - enter: verify existing PIN
 * - forgot: placeholder (not implemented)
 *
 * Props:
 * - pin: { mode, input, confirm, error }
 * - setPinMode(mode)
 * - setPinInput(value)
 * - setPinConfirm(value)
 * - onClose()
 * - onSubmit()
 */
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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[350px] max-w-[90vw] rounded-3xl bg-white p-8 shadow-2xl text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl">
          {isSetup ? "🛠️" : "🔒"}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {isSetup ? "Reset PIN" : "Parent Access"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isSetup
              ? "Create a new 4-digit PIN."
              : "Enter your PIN to access dashboard."}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin.input}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={isSetup ? "New PIN" : "••••"}
            className="w-full text-center text-1xl tracking-[0.5em] font-bold text-purple-700 border-b-2 border-purple-200 focus:border-purple-500 focus:outline-none py-2 bg-transparent"
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
              className="w-full text-center text-1xl tracking-[0.5em] font-bold text-purple-700 border-b-2 border-purple-200 focus:border-purple-500 focus:outline-none py-2 bg-transparent"
            />
          )}
        </div>

        {pin.error && (
          <p className="text-sm text-red-500 font-medium animate-pulse">
            {pin.error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={
              pin.input.length !== 4 || (isSetup && pin.confirm.length !== 4)
            }
            className="flex-1 rounded-full bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSetup ? "Save PIN" : "Unlock"}
          </button>
        </div>

        {!isSetup && (
          <div className="pt-2">
            <button
              onClick={onForgotPin}
              className="text-xs text-gray-400 underline hover:text-purple-600 transition cursor-pointer"
            >
              Forgot PIN?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
