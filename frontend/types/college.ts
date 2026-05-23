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
  slug: string;
  location: string;
  fees: number;
  rating: number;
  placement: number;
  logo?: string | null;
  banner?: string | null;
  image?: string | null;
  campusImages?: string[];
  description?: string | null;
  website?: string | null;
  courses?: string[];
  recruiters?: string[];
  ranking?: number | null;
  featured?: boolean;
  acceptedExams?: string[];
  cutoffRank?: number | null;
  reviews?: Review[];
  createdAt?: string;
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  course?: string;
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
