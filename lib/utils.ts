import { clsx } from "clsx";
import { format } from "date-fns";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "N/A";
  }

  return format(new Date(value), "dd MMM yyyy");
}

export function toTitleCase(value: string) {
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function escapeCsv(value: string | null | undefined) {
  const safeValue = value ?? "";
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function buildQueryString(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
}
