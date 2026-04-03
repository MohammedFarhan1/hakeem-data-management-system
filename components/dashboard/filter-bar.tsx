import { AcademicYearOption, RecordFilters, ReferenceOption } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  filters: RecordFilters;
  departments: ReferenceOption[];
  academicYears: AcademicYearOption[];
  categories: ReferenceOption[];
  hideDepartment?: boolean;
}

export function FilterBar({
  filters,
  departments,
  academicYears,
  categories,
  hideDepartment = false
}: FilterBarProps) {
  return (
    <form className="grid gap-3 rounded-[24px] border border-slate-200 bg-linen p-4 md:grid-cols-5">
      {!hideDepartment && (
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Department</span>
          <select
            name="departmentId"
            defaultValue={filters.departmentId ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0"
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Academic year</span>
        <select
          name="academicYearId"
          defaultValue={filters.academicYearId ?? ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0"
        >
          <option value="">All academic years</option>
          {academicYears.map((academicYear) => (
            <option key={academicYear.id} value={academicYear.id}>
              {academicYear.year}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Category</span>
        <select
          name="categoryId"
          defaultValue={filters.categoryId ?? ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Status</span>
        <select
          name="status"
          defaultValue={filters.status ?? ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </label>

      <div className="flex items-end gap-3">
        <Button className="w-full" type="submit">
          Apply filters
        </Button>
      </div>
    </form>
  );
}
