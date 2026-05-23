import { Request, Response } from "express";
import { colleges } from "../data/colleges";

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

const formatCollege = (college: any) => college;

export const getColleges = async (_req: Request, res: Response) => {
  res.json({
    data: colleges.map(formatCollege),
    pagination: {
      page: 1,
      limit: colleges.length,
      total: colleges.length,
      totalPages: 1,
    },
  });
};

export const getFeaturedColleges = async (
  _req: Request,
  res: Response
) => {
  res.json(
    colleges
      .filter((college) => college.featured)
      .map(formatCollege)
  );
};

export const getCollegeById = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid college id",
    });
  }

  const college = colleges.find(
    (item) => item.id === id
  );

  if (!college) {
    return res.status(404).json({
      message: "College not found",
    });
  }

  res.json(formatCollege(college));
};

export const compareColleges = async (
  req: Request,
  res: Response
) => {
  const ids =
    typeof req.query.ids === "string"
      ? req.query.ids
          .split(",")
          .map((value) => Number(value.trim()))
          .filter(
            (value) =>
              Number.isInteger(value) &&
              value > 0
          )
      : [];

  const compared = colleges
    .filter((college) =>
      ids.includes(college.id)
    )
    .map(formatCollege);

  res.json(compared);
};

export const getLocations = async (
  _req: Request,
  res: Response
) => {
  const locations = [
    ...new Set(
      colleges.map(
        (college) => college.location
      )
    ),
  ].sort();

  res.json(locations);
};

export const getCourses = async (
  _req: Request,
  res: Response
) => {
  const courses = [
    ...new Set(
      colleges.flatMap(
        (college) => college.courses ?? []
      )
    ),
  ].sort();

  res.json(courses);
};