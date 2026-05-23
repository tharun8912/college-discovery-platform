export interface Review {
  id: number;
  collegeId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface College {
  id: number;
  name: string;
  slug?: string;
  shortName?: string;
  location: string;
  state?: string;
  fees: number;
  rating: number; // Backwards compatible rating
  careers360Rating?: number; // Out of 5.0
  placement: number; // Backwards compatible placement
  placementPercentage?: number;
  avgPackage?: number; // In LPA
  highestPackage?: number; // In LPA
  logo?: string | null;
  banner?: string | null;
  image?: string | null;
  campusImages?: string[];
  description?: string | null;
  detailedOverview?: string;
  admissionProcess?: string;
  eligibility?: string;
  website?: string | null; // Backwards compatible website
  officialWebsite?: string;
  courses?: string[];
  acceptedExams?: string[]; // Backwards compatible accepted exams
  examsAccepted?: string[];
  cutoffRank?: number | null;
  recruiters?: string[];
  ranking?: number | null; // Backwards compatible ranking
  nirfRank?: number | null;
  ownershipType?: string;
  establishedYear?: number;
  accreditation?: string;
  featured?: boolean;
  facilities?: string[];
  rankings?: string[];
  images?: string[];
  campusSize?: string;
  facultyCount?: number;
  studentCount?: number;
  reviews?: Review[];
  createdAt?: string;
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  state?: string;
  minFees?: number;
  maxFees?: number;
  course?: string;
  ownershipType?: string;
  exam?: string;
  maxNirfRank?: number;
  minAvgPackage?: number;
  minPlacementPercentage?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedColleges {
  data: College[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  answers?: Answer[];
  _count?: { answers: number };
}

export interface Answer {
  id: number;
  questionId: number;
  body: string;
  author: string;
  createdAt: string;
}

export interface SavedComparison {
  id: number;
  name: string | null;
  collegeIds: number[];
  createdAt: string;
}
