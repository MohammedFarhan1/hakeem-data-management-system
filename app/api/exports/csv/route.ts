import { NextResponse } from "next/server";

import { getCurrentUserAndProfile } from "@/lib/auth";
import { getFilteredRecords, parseRecordFilters } from "@/lib/data";
import { recordsToCsv } from "@/lib/export";

export async function GET(request: Request) {
  const { user, serviceUnavailable } = await getCurrentUserAndProfile();

  if (serviceUnavailable) {
    return NextResponse.json({ error: "Supabase is currently unreachable." }, { status: 503 });
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filters = parseRecordFilters(new URL(request.url).searchParams);
  const { records, serviceUnavailable: recordsUnavailable } = await getFilteredRecords(filters);

  if (recordsUnavailable) {
    return NextResponse.json({ error: "Supabase is currently unreachable." }, { status: 503 });
  }

  const csv = recordsToCsv(records);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hdms-report.csv"`
    }
  });
}
