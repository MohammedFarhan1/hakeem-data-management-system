import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";

import { RecordFilters, RecordItem } from "@/lib/types";
import { escapeCsv } from "@/lib/utils";

export function recordsToCsv(records: RecordItem[]) {
  const header = [
    "Title",
    "Category",
    "Department",
    "Academic Year",
    "Status",
    "Created By",
    "Created At",
    "Description"
  ];

  const lines = records.map((record) =>
    [
      escapeCsv(record.title),
      escapeCsv(record.category),
      escapeCsv(record.department),
      escapeCsv(record.academic_year),
      escapeCsv(record.status),
      escapeCsv(record.created_by_name),
      escapeCsv(record.created_at),
      escapeCsv(record.description)
    ].join(",")
  );

  return [header.join(","), ...lines].join("\n");
}

function drawLine(page: PDFPage, text: string, y: number, font: any, size = 11, color = rgb(0.06, 0.09, 0.16)) {
  page.drawText(text, {
    x: 40,
    y,
    size,
    font,
    color
  });
}

export async function recordsToPdf(records: RecordItem[], filters: RecordFilters) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

  drawLine(page, "HDMS Report", 550, titleFont, 22, rgb(0.06, 0.36, 0.3));
  drawLine(
    page,
    `Filters: Department=${filters.departmentId ?? "All"} | AcademicYear=${filters.academicYearId ?? "All"} | Category=${filters.categoryId ?? "All"} | Status=${filters.status ?? "All"}`,
    520,
    bodyFont,
    10
  );
  drawLine(page, `Total records: ${records.length}`, 500, bodyFont, 11);

  let y = 470;

  records.slice(0, 18).forEach((record, index) => {
    drawLine(page, `${index + 1}. ${record.title}`, y, titleFont, 11);
    y -= 16;
    drawLine(
      page,
      `Category: ${record.category ?? "N/A"} | Department: ${record.department ?? "N/A"} | Year: ${record.academic_year ?? "N/A"} | Status: ${record.status}`,
      y,
      bodyFont,
      9
    );
    y -= 14;
    drawLine(page, `Created by: ${record.created_by_name ?? "N/A"} | Created at: ${record.created_at}`, y, bodyFont, 9);
    y -= 22;
  });

  if (records.length > 18) {
    drawLine(page, `Showing first 18 of ${records.length} records in this PDF preview.`, 50, bodyFont, 9);
  }

  return pdf.save();
}
