import Link from "next/link";

import { FilterBar } from "@/components/dashboard/filter-bar";
import { RecordsTable } from "@/components/dashboard/records-table";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ServiceStatusBanner } from "@/components/ui/service-status-banner";
import { Button } from "@/components/ui/button";
import { requireAuthenticatedUser } from "@/lib/auth";
import { formSections } from "@/lib/categories";
import { buildSummary, getFilteredRecords, getReferenceData, parseRecordFilters } from "@/lib/data";
import { getSupabaseUnavailableMessage } from "@/lib/supabase/errors";

interface DashboardPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { profile, serviceUnavailable } = await requireAuthenticatedUser();
  const filters = parseRecordFilters(searchParams);
  const [referenceData, recordData] = await Promise.all([getReferenceData(), getFilteredRecords(filters)]);
  const { departments, academicYears, categories } = referenceData;
  const { records } = recordData;
  const summary = buildSummary(records);
  const showServiceWarning = serviceUnavailable || referenceData.serviceUnavailable || recordData.serviceUnavailable;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[32px] bg-[linear-gradient(135deg,_rgba(15,92,77,1),_rgba(24,24,27,0.92))] p-8 text-white md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Workspace</p>
          <h1 className="mt-3 font-serif text-4xl">Welcome back, {profile?.name ?? "HDMS User"}.</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Monitor submissions, apply filters, and move into dedicated HDMS sections for detailed form access.
          </p>
        </div>
        <Link href="/sections/departmental-input" prefetch>
          <Button className="bg-white text-forest hover:bg-white/90">Open sections</Button>
        </Link>
      </section>

      {showServiceWarning ? <ServiceStatusBanner message={getSupabaseUnavailableMessage()} /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {summary.metrics.map((metric) => (
          <SummaryCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Submission overview</h2>
            <p className="text-slate-600">Use filters to narrow visible records before reviewing or exporting them.</p>
          </div>
        </div>
        <FilterBar
          academicYears={academicYears}
          categories={categories}
          departments={departments}
          filters={filters}
          hideDepartment={profile?.role === "faculty"}
        />
        <RecordsTable
          records={records}
          emptyState={
            showServiceWarning
              ? "Records are temporarily unavailable because Supabase could not be reached."
              : "No records match the current filters."
          }
        />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Browse Sections</h2>
          <p className="text-slate-600">
            Open a section first, then choose from the forms that belong to that module.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {formSections.map((section) => (
            <Link
              key={section.id}
              href={`/sections/${section.id}`}
              prefetch
              className="rounded-[28px] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-forest/20"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest/70">Section</p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">{section.label}</h3>
              <p className="mt-3 text-slate-600">{section.description}</p>
              <p className="mt-4 text-sm text-slate-500">{section.categories.length} forms available</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
