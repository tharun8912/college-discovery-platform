import type { College } from "@/types/college";

export type CompareMetric = "fees" | "placement" | "rating" | "courseCount";

export function metricValue(college: College, metric: CompareMetric): number {
  switch (metric) {
  case "fees":
    return college.fees ?? 0;

  case "placement":
    return college.placement ?? 0;

  case "rating":
    return college.rating ?? 0;

  case "courseCount":
    return (college.courses ?? []).length;

  default:
    return 0;
}
}

/** Lower fees is better; higher placement, rating, course count is better. */
export function getBestCollegeIds(
  colleges: College[],
  metric: CompareMetric
): Set<number> {
  if (colleges.length < 2) return new Set();

  const lowerIsBetter = metric === "fees";
  const values = colleges.map((c) => ({ id: c.id, value: metricValue(c, metric) }));
  const target = lowerIsBetter
    ? Math.min(...values.map((v) => v.value))
    : Math.max(...values.map((v) => v.value));

  return new Set(values.filter((v) => v.value === target).map((v) => v.id));
}

export function formatFees(fees: number): string {
  if (fees >= 100000) {
    const lakhs = fees / 100000;
    return lakhs % 1 === 0 ? `₹${lakhs}L` : `₹${lakhs.toFixed(1)}L`;
  }
  return `₹${fees.toLocaleString("en-IN")}`;
}

export function buildShareUrl(ids: number[], origin: string): string {
  return `${origin}/compare?ids=${ids.join(",")}`;
}

export function buildComparisonExport(colleges: College[]): string {
  const lines = [
    "CampusCompass — College Comparison",
    `Generated: ${new Date().toLocaleString()}`,
    "",
  ];

  for (const c of colleges) {
    lines.push(`■ ${c.name}`);
    lines.push(`  Location: ${c.location}`);
    lines.push(`  Fees: ${formatFees(c.fees)}/yr`);
    lines.push(`  Rating: ${(c.rating ?? 0).toFixed(1)}`);
    lines.push(`  Courses: ${(c.courses ?? []).join(", ") || "—"}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function buildComparisonCsv(colleges: College[]): string {
  const headers = ["College", "Location", "Fees (INR/yr)", "Placement %", "Rating", "Courses"];
  const rows = colleges.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.location.replace(/"/g, '""')}"`,
    c.fees,
    c.placement,
    c.rating,
    `"${(c.courses ?? []).join(", ").replace(/"/g, '""')}"`,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
