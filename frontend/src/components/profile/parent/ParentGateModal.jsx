/**
 * ParentGateModal.jsx
 * -------------------
 * PIN gate modal for Parent Area.
 *
 * Modes:
 * - enter: verify existing PIN
 * - create: create/change PIN (requires confirmation)
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
  setPinMode,
  setPinInput,
  setPinConfirm,
  onClose,
  onSubmit,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose} // click outside closes
    >
      <div
        className="w-[420px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Title changes by mode */}
        <h2 className="text-lg font-semibold text-gray-800">
          {pin.mode === "enter" && "Parent Access"}
          {pin.mode === "create" && "Create / Change Parent PIN"}
          {pin.mode === "forgot" && "Forgot PIN"}
        </h2>

        {/* Subtitle changes by mode */}
        <p className="mt-1 text-sm text-gray-500">
          {pin.mode === "enter" && "Enter your 4-digit PIN"}
          {pin.mode === "create" && "Choose a new 4-digit PIN"}
          {pin.mode === "forgot" && "Reset PIN flow (not implemented yet)"}
        </p>

        {/* Main PIN input */}
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin.input}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="••••"
          className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-lg
                     focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        {/* Confirmation input only in create mode */}
        {pin.mode === "create" && (
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin.confirm}
            onChange={(e) => setPinConfirm(e.target.value)}
            placeholder="Confirm PIN"
            className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        )}

        {/* Error message */}
        {pin.error && <p className="mt-2 text-sm text-red-600">{pin.error}</p>}

        {/* Mode switch links */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setPinMode("create")}
            className="text-purple-600 hover:underline"
          >
            Create / Change PIN
          </button>

          <button
            type="button"
            onClick={() => setPinMode("forgot")}
            className="text-gray-600 hover:underline"
          >
            Forgot PIN?
          </button>
        </div>

        {/* Footer buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="flex-1 rounded-xl bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
