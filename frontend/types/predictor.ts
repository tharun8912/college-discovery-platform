import type { College } from "@/types/college";

export type ChanceLevel = "safe" | "moderate" | "borderline" | "reach" | "dream";

export interface ExamOption {
  id: string;
  label: string;
  popular?: boolean;
}

export interface CategoryOption {
  id: string;
  label: string;
  description: string;
}

export interface CollegePrediction {
  college: College;
  probability: number;
  chanceLevel: ChanceLevel;
  effectiveCutoff: number | null;
  baseCutoff: number | null;
  placement: number;
  fees: number;
  rating: number;
}

export interface PredictorSummary {
  safe: number;
  moderate: number;
  borderline: number;
  reach: number;
  dream: number;
}

export interface PredictorResponse {
  exam: string;
  rank: number;
  category: string;
  categoryLabel: string;
  predictions: CollegePrediction[];
  summary: PredictorSummary;
  total: number;
  message: string;
}
