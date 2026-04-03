import Link from "next/link";

import { FilterBar } from "@/components/dashboard/filter-bar";
import { RecordsTable } from "@/components/dashboard/records-table";
import { ServiceStatusBanner } from "@/components/ui/service-status-banner";
import { Button } from "@/components/ui/button";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getSupabaseUnavailableMessage } from "@/lib/supabase/errors";
import { buildQueryString } from "@/lib/utils";
import { getFilteredRecords, getReferenceData, parseRecordFilters } from "@/lib/data";

interface ReportsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { profile, serviceUnavailable } = await requireAuthenticatedUser();
  const filters = parseRecordFilters(searchParams);
  const [referenceData, recordData] = await Promise.all([getReferenceData(), getFilteredRecords(filters)]);
  const { departments, academicYears, categories } = referenceData;
  const { records } = recordData;
  const showServiceWarning = serviceUnavailable || referenceData.serviceUnavailable || recordData.serviceUnavailable;
  const queryString = buildQueryString({
    departmentId: filters.departmentId,
    academicYearId: filters.academicYearId,
    categoryId: filters.categoryId,
    status: filters.status
  });

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">Reports</p>
          <h1 className="mt-3 font-serif text-4xl text-ink">Filtered export center</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Apply filters first, then export the exact scoped dataset as CSV or PDF. Faculty exports stay limited to
            their accessible records, while admins can export institution-wide views.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/api/exports/csv${queryString ? `?${queryString}` : ""}`} prefetch={false}>
            <Button variant="secondary">Export CSV</Button>
          </Link>
          <Link href={`/api/exports/pdf${queryString ? `?${queryString}` : ""}`} prefetch={false}>
            <Button>Generate PDF</Button>
          </Link>
        </div>
      </section>

      {showServiceWarning ? <ServiceStatusBanner message={getSupabaseUnavailableMessage()} /> : null}

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
            ? "Reports are temporarily unavailable because Supabase could not be reached."
            : "No report data is available for the selected filters."
        }
      />
    </div>
  );
}
