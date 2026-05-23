import type { College, PaginatedColleges } from "@/types/college";

const EMPTY_PAGINATION = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

function isPaginatedColleges(value: unknown): value is PaginatedColleges {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "pagination" in value &&
    Array.isArray((value as PaginatedColleges).data)
  );
}

/** Unwrap `{ data, pagination }` or a bare array into paginated shape. */
export function unwrapPaginatedColleges(payload: unknown): PaginatedColleges {
  if (isPaginatedColleges(payload)) {
    return payload;
  }

  if (Array.isArray(payload)) {
    const list = payload as College[];
    return {
      data: list,
      pagination: {
        page: 1,
        limit: list.length || 12,
        total: list.length,
        totalPages: 1,
      },
    };
  }

  return { data: [], pagination: EMPTY_PAGINATION };
}

/** Unwrap a direct array or `{ data: T[] }` list response. */
export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }

  return [];
}
