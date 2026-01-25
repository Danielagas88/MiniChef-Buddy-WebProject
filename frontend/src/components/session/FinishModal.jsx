/* FinishModal.jsx - Neon Glass Edition */
export default function FinishModal({
  recipeTitle,
  isUploading,
  isUploadSuccess,
  uploadError,
  onUpload,
  onViewProfile,
  onDone,
}) {
  return (
    <div className="fixed inset-0 z-110 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in transition-all">
      <div className="bg-(--card-surface) backdrop-blur-2xl rounded-[3rem] p-10 max-w-sm w-full text-center shadow-xl space-y-8 border border-(--card-surface-border) relative overflow-hidden transition-all">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="text-7xl animate-bounce relative z-10 drop-shadow-lg">
          🎉
        </div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl font-black text-(--text-primary) tracking-tight">
            Great Job!
          </h2>

          <p className="text-(--text-primary) font-medium">
            You finished cooking{" "}
            <span className="text-(--accent-emerald) font-bold">
              {recipeTitle}
            </span>
            !
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {uploadError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
              {uploadError}
            </div>
          )}
          {!isUploadSuccess ? (
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                disabled={isUploading}
                aria-label="Upload photo of your cooked dish"
              />
              <button
                disabled={isUploading}
                className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 border-2 backdrop-blur-md shadow-md relative z-10 ${
                  isUploading
                    ? "bg-(--input-bg) text-(--muted) border-(--border-color) cursor-not-allowed"
                    : "bg-(--input-bg) text-(--accent-emerald) border-emerald-500/50 hover:border-emerald-500 hover:opacity-90 group-active:scale-95"
                }`}
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Uploading...
                  </>
                ) : (
                  "📸 Upload Photo"
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onViewProfile}
              className="w-full py-4 rounded-2xl font-black bg-(--input-bg) text-(--accent-emerald) border-2 border-emerald-500/50 backdrop-blur-md hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md animate-bounce-in"
            >
              🖼️ View in My Profile
            </button>
          )}

          <button
            onClick={onDone}
            className="w-full py-4 rounded-2xl bg-amber-400 text-slate-900 font-black text-lg hover:bg-amber-500 transition-all active:scale-95 shadow-lg border-2 border-amber-500/50"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
