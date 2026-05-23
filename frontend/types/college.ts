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
  shortName?: string | null;
  location: string;
  state?: string | null;
  nirfRank?: number | null;
  careers360Rating?: number | null;
  fees: number;
  avgPackage?: number | null;
  highestPackage?: number | null;
  placementPercentage?: number | null;
  courses?: string[];
  examsAccepted?: string[];
  ownershipType?: string | null;
  establishedYear?: number | null;
  accreditation?: string | null;
  featured?: boolean;
  description?: string | null;
  detailedOverview?: string | null;
  admissionProcess?: string | null;
  eligibility?: string | null;
  facilities?: string[];
  recruiters?: string[];
  rankings?: any;
  images?: any;
  logo?: string | null;
  campusSize?: string | null;
  facultyCount?: number | null;
  studentCount?: number | null;
  officialWebsite?: string | null;
  
  // Legacy fields
  rating?: number | null;
  placement?: number | null;
  banner?: string | null;
  image?: string | null;
  campusImages?: string[];
  website?: string | null;
  ranking?: number | null;
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
