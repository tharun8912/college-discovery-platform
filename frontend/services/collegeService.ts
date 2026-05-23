import api from "@/lib/api";
import { unwrapList, unwrapPaginatedColleges } from "@/lib/apiResponse";
import type {
  College,
  CollegeFilters,
  PaginatedColleges,
} from "@/types/college";

/** College routes use `/colleges` (not `/api/colleges`) — matches Render deployment. */
const COLLEGES = "/colleges";

export const getColleges = async (
  filters: CollegeFilters = {}
): Promise<PaginatedColleges> => {
  const params: Record<string, string | number> = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.location && filters.location !== "all")
    params.location = filters.location;
  if (filters.course && filters.course !== "all") params.course = filters.course;
  if (filters.minFees) params.minFees = filters.minFees;
  if (filters.maxFees) params.maxFees = filters.maxFees;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const { data } = await api.get<unknown>(COLLEGES, { params });
  return unwrapPaginatedColleges(data);
};

export const getFeaturedColleges = async (): Promise<College[]> => {
  const { data } = await api.get<unknown>(`${COLLEGES}/featured`);
  return unwrapList<College>(data);
};

export const getCollegeById = async (id: number): Promise<College> => {
  const { data } = await api.get<College>(`${COLLEGES}/${id}`);
  return data;
};

export const getLocations = async (): Promise<string[]> => {
  const { data } = await api.get<unknown>(`${COLLEGES}/locations`);
  return unwrapList<string>(data);
};

export const getCourses = async (): Promise<string[]> => {
  const { data } = await api.get<unknown>(`${COLLEGES}/courses`);
  return unwrapList<string>(data);
};

export const compareColleges = async (ids: number[]): Promise<College[]> => {
  const { data } = await api.get<unknown>(`${COLLEGES}/compare`, {
    params: { ids: ids.join(",") },
  });
  return unwrapList<College>(data);
};
