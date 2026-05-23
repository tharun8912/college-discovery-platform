export interface Review {
  id: number;
  collegeId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CollegeRankingItem {
  source: string;
  label: string;
  rank: number;
  year: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface College {
  id: number;
  slug?: string;
  name: string;
  shortName?: string;
  location: string;
  state?: string;
  nirfRank?: number | null;
  careers360Rating?: number;
  fees: number;
  avgPackage?: number;
  highestPackage?: number;
  placementPercentage?: number;
  courses?: string[];
  examsAccepted?: string[];
  ownershipType?: "Government" | "Private" | "Deemed" | "Autonomous" | "Central Government";
  establishedYear?: number;
  accreditation?: string[];
  featured?: boolean;
  description?: string | null;
  detailedOverview?: string | null;
  admissionProcess?: string | null;
  eligibility?: string | null;
  facilities?: string[];
  recruiters?: string[];
  rankings?: CollegeRankingItem[];
  images?: string[];
  logo?: string | null;
  campusSize?: string;
  facultyCount?: number;
  studentCount?: number;
  officialWebsite?: string | null;
  reviews?: Review[];
  hostelDetails?: string | null;
  faq?: FAQItem[];
  cutoffOverview?: string | null;

  // Backward-compatible aliases used by the current UI
  rating?: number;
  placement?: number;
  banner?: string | null;
  website?: string | null;
  ranking?: number | null;
  acceptedExams?: string[];
  faculty?: number;
  students?: number;
  collegeType?: string;
  package?: {
    average: number;
    highest: number;
  };
  campusImages?: string[];
  cutoffRank?: number | null;
  createdAt?: string;
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  minPlacement?: number;
  maxPlacement?: number;
  minNirfRank?: number;
  maxNirfRank?: number;
  ownershipType?: string;
  exam?: string;
  course?: string;
  sortBy?: "fees" | "placement" | "rating" | "nirfRank" | "name";
  sortOrder?: "asc" | "desc";
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
