import { Request, Response } from "express";
import { colleges, type CollegeRecord } from "../data/colleges";

type SortOrder = "asc" | "desc";

interface CollegeApiRecord extends CollegeRecord {
  rating: number;
  placement: number;
  banner: string;
  website: string;
  ranking: number | null;
  acceptedExams: string[];
  faculty: number;
  students: number;
  collegeType: string;
  package: {
    average: number;
    highest: number;
  };
}

interface CollegeQuery {
  search?: string;
  location?: string;
  state?: string;
  city?: string;
  course?: string;
  exam?: string;
  ownershipType?: string;
  minFees?: number;
  maxFees?: number;
  minPlacement?: number;
  maxPlacement?: number;
  minNirfRank?: number;
  maxNirfRank?: number;
  sortBy?: "fees" | "placement" | "rating" | "nirfRank" | "name";
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseQuery(query: Request["query"]): CollegeQuery {
  return {
    search: toString(query.search),
    location: toString(query.location),
    state: toString(query.state),
    city: toString(query.city),
    course: toString(query.course),
    exam: toString(query.exam),
    ownershipType: toString(query.ownershipType),
    minFees: toNumber(query.minFees),
    maxFees: toNumber(query.maxFees),
    minPlacement: toNumber(query.minPlacement),
    maxPlacement: toNumber(query.maxPlacement),
    minNirfRank: toNumber(query.minNirfRank),
    maxNirfRank: toNumber(query.maxNirfRank),
    sortBy:
      query.sortBy === "fees" ||
      query.sortBy === "placement" ||
      query.sortBy === "rating" ||
      query.sortBy === "nirfRank" ||
      query.sortBy === "name"
        ? query.sortBy
        : undefined,
    sortOrder: query.sortOrder === "asc" ? "asc" : "desc",
    page: Math.max(1, toNumber(query.page) ?? 1),
    limit: Math.min(50, Math.max(1, toNumber(query.limit) ?? 12)),
  };
}

function formatCollege(record: CollegeRecord): CollegeApiRecord {
  const ranking = record.nirfRank ?? record.rankings.find((r) => r.source === "NIRF")?.rank ?? null;

  return {
    ...record,
    rating: record.careers360Rating,
    placement: record.placementPercentage,
    banner: record.images[0] ?? record.logo,
    website: record.officialWebsite,
    ranking,
    acceptedExams: record.examsAccepted,
    faculty: record.facultyCount,
    students: record.studentCount,
    collegeType: record.ownershipType,
    package: {
      average: record.avgPackage,
      highest: record.highestPackage,
    },
  };
}

function includesText(source: string, term: string): boolean {
  return source.toLowerCase().includes(term.toLowerCase());
}

function matchesFilters(record: CollegeRecord, filters: CollegeQuery): boolean {
  if (filters.search) {
    const search = filters.search.toLowerCase();
    const haystack = [
      record.name,
      record.shortName,
      record.location,
      record.state,
      record.description,
      record.detailedOverview,
      ...record.courses,
      ...record.examsAccepted,
      ...record.recruiters,
      ...record.facilities,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) return false;
  }

  if (filters.location) {
    const location = filters.location.toLowerCase();
    if (
      !record.location.toLowerCase().includes(location) &&
      !record.state.toLowerCase().includes(location)
    ) {
      return false;
    }
  }

  if (filters.state && !includesText(record.state, filters.state)) return false;
  if (filters.city && !includesText(record.location, filters.city)) return false;

  if (filters.course) {
    const course = filters.course.toLowerCase();
    if (!record.courses.some((value) => value.toLowerCase().includes(course))) return false;
  }

  if (filters.exam) {
    const exam = filters.exam.toLowerCase();
    if (!record.examsAccepted.some((value) => value.toLowerCase().includes(exam))) return false;
  }

  if (filters.ownershipType && record.ownershipType !== filters.ownershipType) return false;
  if (filters.minFees != null && record.fees < filters.minFees) return false;
  if (filters.maxFees != null && record.fees > filters.maxFees) return false;
  if (filters.minPlacement != null && record.placementPercentage < filters.minPlacement) return false;
  if (filters.maxPlacement != null && record.placementPercentage > filters.maxPlacement) return false;

  if (filters.minNirfRank != null) {
    const rank = record.nirfRank ?? Number.MAX_SAFE_INTEGER;
    if (rank > filters.minNirfRank) return false;
  }

  if (filters.maxNirfRank != null) {
    const rank = record.nirfRank ?? Number.MAX_SAFE_INTEGER;
    if (rank < filters.maxNirfRank) return false;
  }

  return true;
}

function sortColleges(list: CollegeRecord[], filters: CollegeQuery): CollegeRecord[] {
  const sortBy = filters.sortBy ?? "rating";
  const sortOrder = filters.sortOrder ?? "desc";

  return [...list].sort((a, b) => {
    let diff = 0;

    switch (sortBy) {
      case "fees":
        diff = a.fees - b.fees;
        break;
      case "placement":
        diff = a.placementPercentage - b.placementPercentage;
        break;
      case "nirfRank": {
        const left = a.nirfRank ?? Number.MAX_SAFE_INTEGER;
        const right = b.nirfRank ?? Number.MAX_SAFE_INTEGER;
        diff = right - left;
        break;
      }
      case "name":
        diff = a.name.localeCompare(b.name);
        break;
      case "rating":
      default:
        diff = a.careers360Rating - b.careers360Rating;
        break;
    }

    return sortOrder === "asc" ? diff : -diff;
  });
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

function getFilteredColleges(query: Request["query"]) {
  const filters = parseQuery(query);
  const filtered = colleges.filter((college) => matchesFilters(college, filters));
  const sorted = sortColleges(filtered, filters);
  const paginated = paginate(sorted.map(formatCollege), filters.page ?? 1, filters.limit ?? 12);

  return { filters, paginated };
}

export const getColleges = async (req: Request, res: Response) => {
  const { paginated } = getFilteredColleges(req.query);
  res.json(paginated);
};

export const getFeaturedColleges = async (_req: Request, res: Response) => {
  res.json(colleges.filter((college) => college.featured).map(formatCollege));
};

export const getCollegeById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid college id" });
  }

  const college = colleges.find((item) => item.id === id);

  if (!college) {
    return res.status(404).json({
      message: "College not found",
    });
  }

  res.json(formatCollege(college));
};

export const compareColleges = async (req: Request, res: Response) => {
  const ids = typeof req.query.ids === "string"
    ? req.query.ids
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value > 0)
    : [];

  const compared = colleges
    .filter((college) => ids.includes(college.id))
    .map(formatCollege);

  res.json(compared);
};

export const getLocations = async (_req: Request, res: Response) => {
  const locations = [...new Set(colleges.map((college) => college.location))].sort();
  res.json(locations);
};

export const getCourses = async (_req: Request, res: Response) => {
  const courses = [...new Set(colleges.flatMap((college) => college.courses))].sort();
  res.json(courses);
};
