import { FilterBar } from "@/components/dashboard/filter-bar";
import { RecordsTable } from "@/components/dashboard/records-table";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ServiceStatusBanner } from "@/components/ui/service-status-banner";
import { requireAdminUser } from "@/lib/auth";
import { buildSummary, getFilteredRecords, getReferenceData, parseRecordFilters } from "@/lib/data";
import { getSupabaseUnavailableMessage } from "@/lib/supabase/errors";

interface AdminPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { serviceUnavailable } = await requireAdminUser();
  const filters = parseRecordFilters(searchParams);
  const [referenceData, recordData] = await Promise.all([getReferenceData(), getFilteredRecords(filters)]);
  const { departments, academicYears, categories } = referenceData;
  const { records } = recordData;
  const summary = buildSummary(records);
  const showServiceWarning = serviceUnavailable || referenceData.serviceUnavailable || recordData.serviceUnavailable;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">Admin console</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">Institution-wide monitoring</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Review all records, compare departmental activity, and inspect the institution-wide submission pipeline.
        </p>
      </section>

      {showServiceWarning ? <ServiceStatusBanner message={getSupabaseUnavailableMessage()} /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {summary.metrics.map((metric) => (
          <SummaryCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="space-y-4">
        <FilterBar academicYears={academicYears} categories={categories} departments={departments} filters={filters} />
        <RecordsTable
          records={records}
          emptyState={
            showServiceWarning
              ? "Institutional records are temporarily unavailable because Supabase could not be reached."
              : "No institutional records match the current filters."
          }
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 p-5">
          <h2 className="text-xl font-semibold text-ink">Department-wise count</h2>
          <div className="mt-4 space-y-3">
            {summary.departmentBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-linen px-4 py-3">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 p-5">
          <h2 className="text-xl font-semibold text-ink">Category-wise count</h2>
          <div className="mt-4 space-y-3">
            {summary.categoryBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-linen px-4 py-3">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
