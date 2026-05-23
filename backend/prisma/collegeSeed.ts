/** Seed payload shape — mirrors the College model without Prisma relation fields. */
export type CollegeSeed = {
  slug: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement: number;
  featured: boolean;
  logo?: string;
  banner?: string;
  image?: string;
  campusImages?: string[];
  website?: string;
  description?: string;
  courses: string[];
  recruiters?: string[];
  ranking?: number;
  acceptedExams: string[];
  cutoffRank?: number;
};
