export default function ParentUsage({
  dailyLimit,
  setDailyLimit,
  allowedFrom,
  setAllowedFrom,
  allowedTo,
  setAllowedTo,
  saveMessage,
  onSave,
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-gray-800">Usage Limits</h3>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Daily usage limit (minutes)
          </label>
          <input
            type="number"
            min="0"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-300"
            placeholder="e.g. 60"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Allowed from
            </label>
            <input
              type="time"
              value={allowedFrom}
              onChange={(e) => setAllowedFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Allowed to
            </label>
            <input
              type="time"
              value={allowedTo}
              onChange={(e) => setAllowedTo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        <button
          onClick={onSave}
          className="rounded-xl bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700"
        >
          Save Settings
        </button>

        {saveMessage && <p className="text-sm text-green-600">{saveMessage}</p>}
      </div>
    </div>
  );
}
