import type { College } from "@/types/college";

export type CompareMetric = "fees" | "placement" | "rating" | "courseCount" | "nirfRank" | "avgPackage" | "highestPackage";

export function metricValue(college: College, metric: CompareMetric): number {
  switch (metric) {
    case "fees":
      return college.fees;
    case "placement":
      return college.placementPercentage || college.placement || 0;
    case "rating":
      return college.careers360Rating || college.rating || 0;
    case "courseCount":
      return college.courses?.length ?? 0;
    case "nirfRank":
      return college.nirfRank || college.ranking || 9999;
    case "avgPackage":
      return college.avgPackage || 0;
    case "highestPackage":
      return college.highestPackage || 0;
  }
}

/** Lower fees/rank is better; higher placement, rating, course count, packages is better. */
export function getBestCollegeIds(
  colleges: College[],
  metric: CompareMetric
): Set<number> {
  if (colleges.length < 2) return new Set();

  const lowerIsBetter = metric === "fees" || metric === "nirfRank";
  const values = colleges.map((c) => ({ id: c.id, value: metricValue(c, metric) }));
  
  // Filter out invalid/empty ones for lowerIsBetter
  const validValues = lowerIsBetter && metric === "nirfRank" ? values.filter(v => v.value !== 9999) : values;
  if (validValues.length === 0) return new Set();

  const target = lowerIsBetter
    ? Math.min(...validValues.map((v) => v.value))
    : Math.max(...validValues.map((v) => v.value));

  return new Set(validValues.filter((v) => v.value === target).map((v) => v.id));
}

export function formatFees(fees: number): string {
  if (!fees) return "N/A";
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
    lines.push(`  Avg Package: ${formatFees(c.avgPackage || 0)}`);
    lines.push(`  Placement: ${c.placementPercentage || c.placement || 0}%`);
    lines.push(`  Rating: ${(c.careers360Rating || c.rating || 0).toFixed(1)}`);
    lines.push(`  Courses: ${(c.courses ?? []).join(", ") || "—"}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function buildComparisonCsv(colleges: College[]): string {
  const headers = ["College", "Location", "Fees (INR/yr)", "Avg Package (INR)", "Placement %", "Rating", "Courses"];
  const rows = colleges.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.location.replace(/"/g, '""')}"`,
    c.fees,
    c.avgPackage || 0,
    c.placementPercentage || c.placement || 0,
    c.careers360Rating || c.rating || 0,
    `"${(c.courses ?? []).join(", ").replace(/"/g, '""')}"`,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
