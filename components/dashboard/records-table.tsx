import Link from "next/link";

import { RecordItem } from "@/lib/types";
import { formatDate, toTitleCase } from "@/lib/utils";

interface RecordsTableProps {
  records: RecordItem[];
  emptyState: string;
}

export function RecordsTable({ records, emptyState }: RecordsTableProps) {
  if (!records.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-linen p-10 text-center text-slate-600">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-linen text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Academic Year</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Files</th>
              <th className="px-5 py-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold text-ink">{record.title}</p>
                  <p className="mt-1 max-w-md text-slate-500">{record.description ?? "No description provided."}</p>
                </td>
                <td className="px-5 py-4">{record.category ?? "N/A"}</td>
                <td className="px-5 py-4">{record.department ?? "N/A"}</td>
                <td className="px-5 py-4">{record.academic_year ?? "N/A"}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-tide px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                    {toTitleCase(record.status)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-2">
                    {record.files.length ? (
                      record.files.map((file) =>
                        file.signed_url ? (
                          <Link
                            key={file.id}
                            href={file.signed_url}
                            className="text-sm font-medium text-forest underline-offset-2 hover:underline"
                            target="_blank"
                          >
                            {file.file_name ?? "View file"}
                          </Link>
                        ) : (
                          <span key={file.id} className="text-slate-400">
                            {file.file_name ?? "Protected file"}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-slate-400">No files</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p>{formatDate(record.created_at)}</p>
                  <p className="text-slate-500">{record.created_by_name ?? "Unknown"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
