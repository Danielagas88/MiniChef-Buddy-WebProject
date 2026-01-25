import { useEffect, useMemo, useState } from "react";
import { getMyRecipeHistory } from "../../../services/recipeHistoryService.js";
import { computeProgress } from "../../../utils/progressUtils.js";
import ParentDashboardHeader from "./ParentDashboardHeader.jsx";
import ErrorAlert from "./ErrorAlert.jsx";
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
    <section className="space-y-6 animate-fade-in pb-10">
      <ParentDashboardHeader />
      <ErrorAlert message={err} />

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
