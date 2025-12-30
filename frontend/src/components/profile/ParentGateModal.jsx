export default function ParentGateModal({
  pinMode,
  setPinMode,
  pinInput,
  setPinInput,
  pinConfirm,
  setPinConfirm,
  pinError,
  onClose,
  onSubmit,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[420px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-2xl translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          {pinMode === "enter" && "Parent Access"}
          {pinMode === "create" && "Create / Change Parent PIN"}
          {pinMode === "forgot" && "Forgot PIN"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {pinMode === "enter" && "Enter your 4-digit PIN"}
          {pinMode === "create" && "Choose a new 4-digit PIN"}
          {pinMode === "forgot" && "For now: reset PIN (later via database)"}
        </p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
          placeholder="••••"
          className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        {pinMode === "create" && (
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
            placeholder="Confirm PIN"
            className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        )}

        {pinError && <p className="mt-2 text-sm text-red-600">{pinError}</p>}

        <div className="mt-3 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setPinMode("create");
              setPinInput("");
              setPinConfirm("");
            }}
            className="text-purple-600 hover:underline"
          >
            Create / Change PIN
          </button>

          <button
            type="button"
            onClick={() => {
              setPinMode("forgot");
              setPinInput("");
              setPinConfirm("");
            }}
            className="text-gray-600 hover:underline"
          >
            Forgot PIN?
          </button>
        </div>

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
