import { useEffect, useMemo, useState } from "react";
import { getMyRecipeHistory } from "../../../services/recipeHistoryService.js";
import { computeProgress } from "../../../utils/progressUtils.js";
import ParentSummaryCards from "./ParentSummaryCards.jsx";
import ParentRecentCooked from "./ParentRecentCooked.jsx";
import { LayoutDashboard, ShieldCheck } from "lucide-react"; // הוספת אייקונים

export default function ParentDashboard({ token, limit = 10 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr(null);
        const history = await getMyRecipeHistory({ token, limit });
        setItems(history);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load parent report");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token, limit]);

  const stats = useMemo(() => computeProgress(items), [items]);

  return (
    <section className="space-y-6 animate-fade-in pb-10">
      {/* Header - Glassmorphism style */}
      <div className="rounded-[2rem] bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-sm p-8 border border-white/40 dark:border-white/20 flex items-center justify-between gap-4 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Parent{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Dashboard
              </span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium">
            Activity overview, recipes cooked, and child progress
          </p>
        </div>
      </div>

      {err && (
        <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 flex items-center gap-3">
          <span>⚠️</span> {err}
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="relative">
        <ParentSummaryCards
          loading={loading}
          stats={stats}
          loadedCount={items.length}
        />
      </div>

      {/* Recent Activity Table/List */}
      <div className="mt-2">
        <ParentRecentCooked loading={loading} items={items} />
      </div>
    </section>
  );
}
