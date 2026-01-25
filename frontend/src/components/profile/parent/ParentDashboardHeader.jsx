import { ShieldCheck } from "lucide-react";

/**
 * Parent dashboard header component
 */
export default function ParentDashboardHeader() {
  return (
    <div className="rounded-[2rem] bg-(--card-surface) backdrop-blur-md shadow-sm p-8 border border-(--card-surface-border) flex items-center justify-between gap-4 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" size={24} />
          <h2 className="text-2xl md:text-3xl font-black text-(--text-primary) tracking-tight">
            Parent{" "}
            <span className="text-(--accent-emerald)">
              Dashboard
            </span>
          </h2>
        </div>
        <p className="text-sm md:text-base text-(--text-secondary) font-medium">
          Activity overview, recipes cooked, and child progress
        </p>
      </div>
    </div>
  );
}
