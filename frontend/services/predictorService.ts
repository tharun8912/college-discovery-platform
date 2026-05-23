import api from "@/lib/api";
import type {
  CategoryOption,
  ExamOption,
  PredictorResponse,
} from "@/types/predictor";

export const getExams = async (): Promise<ExamOption[]> => {
  const { data } = await api.get<ExamOption[]>("/api/predictor/exams");
  return data;
};

export const getCategories = async (): Promise<CategoryOption[]> => {
  const { data } = await api.get<CategoryOption[]>("/api/predictor/categories");
  return data;
};

export const predictColleges = async (
  exam: string,
  rank: number,
  category: string
): Promise<PredictorResponse> => {
  const { data } = await api.post<PredictorResponse>("/api/predictor/predict", {
    exam,
    rank,
    category,
  });
  return data;
};
