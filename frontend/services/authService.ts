import api from "@/lib/api";
import type { College, SavedComparison } from "@/types/college";

export const getSavedColleges = async (): Promise<College[]> => {
  const { data } = await api.get<College[]>("/api/saved/colleges");
  return data;
};

export const saveCollege = async (collegeId: number) => {
  await api.post(`/api/saved/colleges/${collegeId}`);
};

export const unsaveCollege = async (collegeId: number) => {
  await api.delete(`/api/saved/colleges/${collegeId}`);
};

export const getSavedComparisons = async (): Promise<SavedComparison[]> => {
  const { data } = await api.get<SavedComparison[]>("/api/saved/comparisons");
  return data;
};

export const saveComparison = async (name: string, collegeIds: number[]) => {
  const { data } = await api.post("/api/saved/comparisons", {
    name,
    collegeIds,
  });
  return data;
};
