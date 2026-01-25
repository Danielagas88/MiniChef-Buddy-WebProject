/* FinishModal.jsx - Neon Glass Edition */
export default function FinishModal({
  recipeTitle,
  isUploading,
  isUploadSuccess,
  onUpload,
  onViewProfile,
  onDone,
}) {
  return (
    <div className="fixed inset-0 z-110 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in transition-all">
      <div className="bg-linear-to-br from-white/90 to-white/60 dark:from-white/15 dark:to-white/5 backdrop-blur-2xl rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-8 border border-white/80 dark:border-white/20 relative overflow-hidden transition-all">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="text-7xl animate-bounce relative z-10 drop-shadow-lg">
          🎉
        </div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl font-black text-(--text-primary) tracking-tight">
            Great Job!
          </h2>

          <p className="text-(--text-primary) font-medium">
            You finished cooking{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {recipeTitle}
            </span>
            !
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {!isUploadSuccess ? (
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                disabled={isUploading}
              />
              <button
                className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 border-2 backdrop-blur-md shadow-md relative z-10 ${
                  isUploading
                    ? "bg-slate-100/80 text-slate-400 border-slate-300/50"
                    : "bg-white/80 dark:bg-slate-800/60 text-emerald-700 dark:text-emerald-400 border-emerald-400/60 dark:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500 group-active:scale-95"
                }`}
              >
                {isUploading ? "Uploading..." : "📸 Upload Photo"}
              </button>
            </div>
          ) : (
            <button
              onClick={onViewProfile}
              className="w-full py-4 rounded-2xl font-black bg-white/80 dark:bg-slate-800/60 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-400/60 dark:border-emerald-500/50 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md animate-bounce-in"
            >
              🖼️ View in My Profile
            </button>
          )}

          <button
            onClick={onDone}
            className="w-full py-4 rounded-2xl bg-amber-400 text-slate-900 font-black text-lg hover:bg-amber-500 transition-all active:scale-95 shadow-lg shadow-amber-200/40 dark:shadow-none border-2 border-amber-500/50"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
