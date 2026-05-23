import type { ChanceLevel } from "@/types/predictor";

export const CHANCE_STYLES: Record<
  ChanceLevel,
  { bg: string; text: string; bar: string; label: string }
> = {
  safe: {
    bg: "bg-emerald-50 ring-emerald-200",
    text: "text-emerald-700",
    bar: "bg-emerald-500",
    label: "Safe",
  },
  moderate: {
    bg: "bg-sky-50 ring-sky-200",
    text: "text-sky-700",
    bar: "bg-sky-500",
    label: "Moderate",
  },
  borderline: {
    bg: "bg-amber-50 ring-amber-200",
    text: "text-amber-800",
    bar: "bg-amber-500",
    label: "Borderline",
  },
  reach: {
    bg: "bg-orange-50 ring-orange-200",
    text: "text-orange-700",
    bar: "bg-orange-500",
    label: "Reach",
  },
  dream: {
    bg: "bg-violet-50 ring-violet-200",
    text: "text-violet-700",
    bar: "bg-violet-500",
    label: "Dream",
  },
};

export type ResultFilter = "all" | ChanceLevel;

export function formatPredictorFees(fees: number): string {
  if (fees >= 100000) {
    const lakhs = fees / 100000;
    return lakhs % 1 === 0 ? `₹${lakhs} Lakhs` : `₹${lakhs.toFixed(1)} Lakhs`;
  }
  return `₹${fees.toLocaleString("en-IN")}`;
}
