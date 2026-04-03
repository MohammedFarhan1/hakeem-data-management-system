import { DashboardMetric } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SummaryCard({ label, value, accent }: DashboardMetric) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-5",
        accent === "forest" && "border-forest/10 bg-tide",
        accent === "saffron" && "border-saffron/20 bg-[#fff4d8]",
        accent === "coral" && "border-coral/10 bg-[#fde6e2]"
      )}
    >
      <p className="text-sm uppercase tracking-[0.18em] text-slate-600">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-ink">{value}</p>
    </div>
  );
}
