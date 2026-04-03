import { categoryConfigs } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import {
  AcademicYearOption,
  DashboardSummary,
  RecordFilters,
  RecordItem,
  ReferenceOption
} from "@/lib/types";
import { getErrorMessage, isSupabaseConnectionError } from "@/lib/supabase/errors";

interface ReferenceDataResult {
  departments: ReferenceOption[];
  academicYears: AcademicYearOption[];
  categories: ReferenceOption[];
  serviceUnavailable: boolean;
}

interface RecordsResult {
  records: RecordItem[];
  serviceUnavailable: boolean;
}

function applyRecordFilters<T>(query: T, filters: RecordFilters) {
  let nextQuery = query as {
    eq: (column: string, value: string) => T;
  };

  if (filters.departmentId) {
    nextQuery = nextQuery.eq("department_id", filters.departmentId) as typeof nextQuery;
  }

  if (filters.academicYearId) {
    nextQuery = nextQuery.eq("academic_year_id", filters.academicYearId) as typeof nextQuery;
  }

  if (filters.categoryId) {
    nextQuery = nextQuery.eq("category_id", filters.categoryId) as typeof nextQuery;
  }

  if (filters.status) {
    nextQuery = nextQuery.eq("status", filters.status) as typeof nextQuery;
  }

  return nextQuery as T;
}

function pickRelation<T>(relation: T | T[] | null | undefined) {
  return Array.isArray(relation) ? relation[0] : relation;
}

function mapRecord(row: any): RecordItem {
  const department = pickRelation(row.departments);
  const academicYear = pickRelation(row.academic_years);
  const category = pickRelation(row.categories);
  const createdBy = pickRelation(row.users);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    created_at: row.created_at,
    form_data: row.form_data ?? {},
    department: department?.name ?? null,
    academic_year: academicYear?.year ?? null,
    category: category?.name ?? null,
    created_by_name: createdBy?.name ?? null,
    department_id: row.department_id,
    academic_year_id: row.academic_year_id,
    category_id: row.category_id,
    files:
      row.files?.map((file: any) => ({
        id: file.id,
        file_url: file.file_url,
        file_type: file.file_type,
        file_name: file.file_name,
        signed_url: null
      })) ?? []
  };
}

async function signRecordFiles(records: RecordItem[]) {
  const supabase = createClient();
  const fileEntries = records.flatMap((record) =>
    record.files.map((file) => ({
      recordId: record.id,
      fileId: file.id,
      path: file.file_url
    }))
  );

  if (!fileEntries.length) {
    return records;
  }

  const { data } = await supabase.storage.from("record-files").createSignedUrls(
    fileEntries.map((entry) => entry.path),
    60 * 15
  );

  const signedUrlMap = new Map<string, string | null>();
  fileEntries.forEach((entry, index) => {
    signedUrlMap.set(entry.fileId, data?.[index]?.signedUrl ?? null);
  });

  return records.map((record) => ({
    ...record,
    files: record.files.map((file) => ({
      ...file,
      signed_url: signedUrlMap.get(file.id) ?? null
    }))
  }));
}

export async function getReferenceData(): Promise<ReferenceDataResult> {
  try {
    const supabase = createClient();

    const [{ data: departments }, { data: academicYears }, { data: categories }] = await Promise.all([
      supabase.from("departments").select("id, name").order("name"),
      supabase.from("academic_years").select("id, year").order("year", { ascending: false }),
      supabase.from("categories").select("id, name").order("name")
    ]);

    return {
      departments: (departments ?? []) as ReferenceOption[],
      academicYears: (academicYears ?? []) as AcademicYearOption[],
      categories: (categories ?? []) as ReferenceOption[],
      serviceUnavailable: false
    };
  } catch (error) {
    if (isSupabaseConnectionError(error)) {
      console.warn("Supabase reference data unavailable:", getErrorMessage(error));
      return {
        departments: [],
        academicYears: [],
        categories: [],
        serviceUnavailable: true
      };
    }

    throw error;
  }
}

export async function getFilteredRecords(filters: RecordFilters = {}): Promise<RecordsResult> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("records")
      .select(
        `
          id,
          title,
          description,
          status,
          created_at,
          form_data,
          department_id,
          academic_year_id,
          category_id,
          departments(name),
          academic_years(year),
          categories(name),
          users!records_created_by_fkey(name),
          files(id, file_url, file_type, file_name)
        `
      )
      .order("created_at", { ascending: false });

    query = applyRecordFilters(query, filters);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      records: await signRecordFiles((data ?? []).map(mapRecord)),
      serviceUnavailable: false
    };
  } catch (error) {
    if (isSupabaseConnectionError(error)) {
      console.warn("Supabase records unavailable:", getErrorMessage(error));
      return {
        records: [],
        serviceUnavailable: true
      };
    }

    throw error;
  }
}

export function buildSummary(records: RecordItem[]): DashboardSummary {
  const departmentMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  records.forEach((record) => {
    const departmentLabel = record.department ?? "Unassigned";
    const categoryLabel = record.category ?? "Uncategorized";

    departmentMap.set(departmentLabel, (departmentMap.get(departmentLabel) ?? 0) + 1);
    categoryMap.set(categoryLabel, (categoryMap.get(categoryLabel) ?? 0) + 1);
  });

  return {
    metrics: [
      { label: "Total submissions", value: records.length, accent: "forest" },
      {
        label: "Departments active",
        value: departmentMap.size,
        accent: "saffron"
      },
      {
        label: "Categories used",
        value: categoryMap.size,
        accent: "coral"
      }
    ],
    departmentBreakdown: [...departmentMap.entries()].map(([label, value]) => ({ label, value })),
    categoryBreakdown: [...categoryMap.entries()].map(([label, value]) => ({ label, value }))
  };
}

export function parseRecordFilters(
  input:
    | URLSearchParams
    | Record<string, string | string[] | undefined>
    | { [key: string]: string | undefined }
) {
  const read = (key: string) => {
    if (input instanceof URLSearchParams) {
      return input.get(key) ?? undefined;
    }

    const value = input[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    departmentId: read("departmentId"),
    academicYearId: read("academicYearId"),
    categoryId: read("categoryId"),
    status: read("status")
  } satisfies RecordFilters;
}

export function getCategoryDatabaseName(slug: string) {
  return categoryConfigs.find((category) => category.slug === slug)?.dbCategoryName;
}
