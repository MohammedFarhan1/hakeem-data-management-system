export type Role = "admin" | "faculty";

export type Status = "draft" | "submitted" | "reviewed";

export type FieldType = "text" | "textarea" | "date" | "number" | "email" | "url";

export type CategorySlug =
  | "training-programs"
  | "functional-mou"
  | "mentor-details"
  | "collaborative-activities"
  | "best-practice"
  | "value-added-courses"
  | "skill-enhancement"
  | "infrastructure-facilities"
  | "feedback-report"
  | "outreach-programs"
  | "industrial-visits-internships"
  | "grievance-report"
  | "eminent-visitors"
  | "consultancy-finance"
  | "career-counselling"
  | "activities-conducted"
  | "research-patents"
  | "research-books"
  | "research-guidance"
  | "research-projects"
  | "research-publications";

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  description: string;
  dbCategoryName: string;
  fields: FieldConfig[];
}

export interface FormSectionConfig {
  id: string;
  label: string;
  description: string;
  categories: CategoryConfig[];
}

export interface ReferenceOption {
  id: string;
  name: string;
}

export interface AcademicYearOption {
  id: string;
  year: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  department_id: string | null;
  department_name?: string | null;
}

export interface FileAttachment {
  id: string;
  file_url: string;
  file_type: string;
  file_name: string | null;
  signed_url?: string | null;
}

export interface RecordItem {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  created_at: string;
  form_data: Record<string, string>;
  department: string | null;
  academic_year: string | null;
  category: string | null;
  created_by_name: string | null;
  department_id: string | null;
  academic_year_id: string | null;
  category_id: string | null;
  files: FileAttachment[];
}

export interface DashboardMetric {
  label: string;
  value: number;
  accent: "forest" | "saffron" | "coral";
}

export interface BreakdownItem {
  label: string;
  value: number;
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  departmentBreakdown: BreakdownItem[];
  categoryBreakdown: BreakdownItem[];
}

export interface RecordFilters {
  departmentId?: string;
  academicYearId?: string;
  categoryId?: string;
  status?: string;
}
