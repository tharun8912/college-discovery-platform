import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const parseNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

export const getColleges = async (req: Request, res: Response) => {
  try {
    const { search, location, minFees, maxFees, course, featured, page, limit } =
      req.query;

    const pageNum = Math.max(1, parseNumber(page) ?? 1);
    const limitNum = Math.min(50, Math.max(1, parseNumber(limit) ?? 12));
    const skip = (pageNum - 1) * limitNum;

    const andFilters: Prisma.CollegeWhereInput[] = [];

    if (typeof search === "string" && search.trim()) {
      andFilters.push({
        OR: [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { location: { contains: search.trim(), mode: "insensitive" } },
        ],
      });
    }

    if (typeof location === "string" && location.trim() && location !== "all") {
      andFilters.push({
        location: { equals: location.trim(), mode: "insensitive" },
      });
    }

    if (typeof course === "string" && course.trim() && course !== "all") {
      andFilters.push({ courses: { has: course.trim() } });
    }

    if (featured === "true") {
      andFilters.push({ featured: true });
    }

    const min = parseNumber(minFees);
    const max = parseNumber(maxFees);
    if (min !== undefined || max !== undefined) {
      andFilters.push({
        fees: {
          ...(min !== undefined ? { gte: min } : {}),
          ...(max !== undefined ? { lte: max } : {}),
        },
      });
    }

    const where: Prisma.CollegeWhereInput =
      andFilters.length > 0 ? { AND: andFilters } : {};

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
        skip,
        take: limitNum,
      }),
      prisma.college.count({ where }),
    ]);

    res.json({
      data: colleges,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("getColleges error:", error);
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
};

export const getFeaturedColleges = async (_req: Request, res: Response) => {
  try {
    const colleges = await prisma.college.findMany({
      where: { featured: true },
      orderBy: { rating: "desc" },
      take: 6,
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured colleges" });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid college id" });
      return;
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        reviews: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!college) {
      res.status(404).json({ message: "College not found" });
      return;
    }

    res.json(college);
  } catch (error) {
    console.error("getCollegeById error:", error);
    res.status(500).json({ message: "Failed to fetch college" });
  }
};

export const compareColleges = async (req: Request, res: Response) => {
  try {
    const idsParam = req.query.ids;
    if (typeof idsParam !== "string" || !idsParam.trim()) {
      res.status(400).json({ message: "Provide ids query param (e.g. ids=1,2,3)" });
      return;
    }

    const ids = idsParam
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (ids.length < 2) {
      res.status(400).json({ message: "Select at least 2 colleges to compare" });
      return;
    }

    if (ids.length > 3) {
      res.status(400).json({ message: "You can compare up to 3 colleges at once" });
      return;
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
    });

    const ordered = ids
      .map((id) => colleges.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    res.json(ordered);
  } catch (error) {
    console.error("compareColleges error:", error);
    res.status(500).json({ message: "Failed to compare colleges" });
  }
};

export const getLocations = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.college.findMany({
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    });
    res.json(rows.map((r) => r.location));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};

export const getCourses = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.college.findMany({ select: { courses: true } });
    const set = new Set<string>();
    rows.forEach((r) => r.courses.forEach((c) => set.add(c)));
    res.json([...set].sort());
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
