import { useEffect, useMemo, useState } from "react";
import { getMyRecipeHistory } from "../../../services/recipeHistoryService.js";
import { computeProgress } from "../../../utils/progressUtils.js";
import ParentSummaryCards from "./ParentSummaryCards.jsx";
import ParentRecentCooked from "./ParentRecentCooked.jsx";

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
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white/80 shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">Parent Area</h2>
        <p className="text-sm text-gray-600 mt-1">
          Activity overview, recipes cooked, and child progress.
        </p>
      </div>

      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {err}
        </div>
      )}

      <ParentSummaryCards
        loading={loading}
        stats={stats}
        loadedCount={items.length}
      />

      <ParentRecentCooked loading={loading} items={items} />
    </section>
  );
}
