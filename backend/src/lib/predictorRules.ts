/** Reservation category → cutoff relaxation multiplier (higher = more seats / relaxed rank). */
export const CATEGORY_RULES: Record<
  string,
  { label: string; cutoffMultiplier: number }
> = {
  GENERAL: { label: "General", cutoffMultiplier: 1.0 },
  EWS: { label: "EWS", cutoffMultiplier: 1.12 },
  OBC: { label: "OBC-NCL", cutoffMultiplier: 1.28 },
  SC: { label: "SC", cutoffMultiplier: 1.45 },
  ST: { label: "ST", cutoffMultiplier: 1.5 },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_RULES);

export type ChanceLevel = "safe" | "moderate" | "borderline" | "reach" | "dream";

export function effectiveCutoff(
  baseCutoff: number | null | undefined,
  category: string
): number | null {
  if (baseCutoff == null || baseCutoff <= 0) return null;
  const rule = CATEGORY_RULES[category] ?? CATEGORY_RULES.GENERAL;
  return Math.round(baseCutoff * rule.cutoffMultiplier);
}

/**
 * Rule-based admission probability from rank vs category-adjusted cutoff.
 * Lower rank is better; margin = how much headroom the candidate has.
 */
export function admissionProbability(
  userRank: number,
  cutoff: number | null
): number {
  if (cutoff == null || cutoff <= 0) {
    return 42;
  }

  const margin = (cutoff - userRank) / cutoff;

  if (margin >= 0.4) return 96;
  if (margin >= 0.28) return 88;
  if (margin >= 0.18) return 78;
  if (margin >= 0.1) return 68;
  if (margin >= 0.04) return 58;
  if (margin >= -0.02) return 48;
  if (margin >= -0.08) return 38;
  if (margin >= -0.14) return 28;
  if (margin >= -0.22) return 18;
  if (margin >= -0.32) return 10;
  return 5;
}

export function chanceLevel(probability: number): ChanceLevel {
  if (probability >= 75) return "safe";
  if (probability >= 55) return "moderate";
  if (probability >= 35) return "borderline";
  if (probability >= 15) return "reach";
  return "dream";
}

export function chanceLabel(level: ChanceLevel): string {
  const labels: Record<ChanceLevel, string> = {
    safe: "Safe",
    moderate: "Moderate",
    borderline: "Borderline",
    reach: "Reach",
    dream: "Dream",
  };
  return labels[level];
}
