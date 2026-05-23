import api from "@/lib/api";
import type {
  College,
  CollegeFilters,
  PaginatedColleges,
} from "@/types/college";

export const getColleges = async (
  filters: CollegeFilters = {}
): Promise<PaginatedColleges> => {
  const params: Record<string, string | number> = {};

  if (filters.search?.trim()) params.search = filters.search.trim();

  if (filters.location && filters.location !== "all")
    params.location = filters.location;

  if (filters.course && filters.course !== "all")
    params.course = filters.course;

  if (filters.minFees) params.minFees = filters.minFees;

  if (filters.maxFees) params.maxFees = filters.maxFees;

  if (filters.page) params.page = filters.page;

  if (filters.limit) params.limit = filters.limit;

  const { data } = await api.get<PaginatedColleges>(
    "/colleges",
    { params }
  );

  return data;
};

export const getFeaturedColleges = async (): Promise<College[]> => {
  const { data } = await api.get<College[]>("/colleges/featured");
  return data;
};

export const getCollegeById = async (id: number): Promise<College> => {
  const { data } = await api.get<College>(`/colleges/${id}`);
  return data;
};

export const getLocations = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/colleges/locations");
  return data;
};

export const getCourses = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/colleges/courses");
  return data;
};

export const compareColleges = async (
  ids: number[]
): Promise<College[]> => {
  const { data } = await api.get<College[]>(
    "/colleges/compare",
    {
      params: { ids: ids.join(",") },
    }
  );

  return data;
};