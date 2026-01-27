/**
 * ParentDashboard
 *
 * Parent dashboard content: header, summary cards (time, recipes, badges),
 * and recent cooked list. Stats are computed from all history; the recent
 * list shows only the last 10 sessions. Loads full history via
 * recipeHistoryService and uses progressUtils.
 *
 * @param {Object} props
 * @param {string} props.token - User auth token
 * @param {number} [props.recentListSize=10] - How many items to show in recent list
 *
 * @component
 */
import { useEffect, useMemo, useState } from "react";
import { getMyRecipeHistory } from "../../../services/recipeHistoryService.js";
import { computeProgress } from "../../../utils/progressUtils.js";
import ParentDashboardHeader from "./ParentDashboardHeader.jsx";
import ErrorAlert from "./ErrorAlert.jsx";
import ParentSummaryCards from "./ParentSummaryCards.jsx";
import ParentRecentCooked from "./ParentRecentCooked.jsx";

/** Fetch up to this many items so stats use full history. Backend caps at 10000. */
const FETCH_LIMIT_FOR_STATS = 10000;

export default function ParentDashboard({ token, recentListSize = 10 }) {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr(null);
        const history = await getMyRecipeHistory({ token, limit: FETCH_LIMIT_FOR_STATS });
        setAllItems(history);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load parent report");
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token]);

  const stats = useMemo(() => computeProgress(allItems), [allItems]);
  const recentItems = useMemo(
    () => allItems.slice(0, recentListSize),
    [allItems, recentListSize]
  );

  return (
    <section className="space-y-6 animate-fade-in pb-10">
      <ParentDashboardHeader />
      <ErrorAlert message={err} />

      {/* Stats Summary Cards — computed from full history */}
      <div className="relative">
        <ParentSummaryCards loading={loading} stats={stats} />
      </div>

      {/* Recent Activity — last N sessions only */}
      <div className="mt-2">
        <ParentRecentCooked loading={loading} items={recentItems} />
      </div>
    </section>
  );
}
