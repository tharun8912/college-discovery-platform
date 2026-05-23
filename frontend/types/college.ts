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

  placement?: number;
  rating?: number;

  featured?: boolean;

  image?: string;
  banner?: string;
  images?: string[];

  logo?: string;

  website?: string;
  officialWebsite?: string;

  description?: string;
  detailedOverview?: string;

  courses?: string[];

  examsAccepted?: string[];
  acceptedExams?: string[];

  ownershipType?: string;
  collegeType?: string;

  establishedYear?: number;

  facilities?: string[];
  recruiters?: string[];

  reviews?: any[];

  faculty?: number;
  students?: number;

  ranking?: number | null;

  package?: {
    average?: number;
    highest?: number;
  };
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