import { NextResponse } from "next/server";

import { getCurrentUserAndProfile } from "@/lib/auth";
import { getFilteredRecords, parseRecordFilters } from "@/lib/data";
import { recordsToPdf } from "@/lib/export";

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

  const pdf = await recordsToPdf(records, filters);
  const normalizedPdf = Uint8Array.from(pdf);
  const body = new Blob([normalizedPdf], { type: "application/pdf" });

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="hdms-report.pdf"`
    }
  });
}
