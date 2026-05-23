import { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const parseNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const num = Number(value);

  return Number.isFinite(num) ? num : undefined;
};

function buildWhere(req: Request): Prisma.CollegeWhereInput {
  const { search, location, minFees, maxFees, course, featured, minPlacement } =
    req.query;

  const where: Prisma.CollegeWhereInput = {};

  if (typeof search === "string" && search.trim()) {
    const query = search.trim();
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
    ];
  }

  if (typeof location === "string" && location.trim() && location !== "all") {
    where.location = { equals: location.trim(), mode: "insensitive" };
  }

  if (typeof course === "string" && course.trim() && course !== "all") {
    where.courses = { has: course.trim() };
  }

  if (featured === "true") {
    where.featured = true;
  }

  const min = parseNumber(minFees);
  const max = parseNumber(maxFees);
  const minPlace = parseNumber(minPlacement);

  if (min !== undefined || max !== undefined) {
    where.fees = {};
    if (min !== undefined) {
      where.fees.gte = min;
    }
    if (max !== undefined) {
      where.fees.lte = max;
    }
  }

  if (minPlace !== undefined) {
    where.placement = { gte: minPlace };
  }

  return where;
}

export const getColleges = async (req: Request, res: Response) => {
  try {
    const pageNum = Math.max(1, parseNumber(req.query.page) ?? 1);
    const limitNum = Math.min(50, Math.max(1, parseNumber(req.query.limit) ?? 12));
    const where = buildWhere(req);

    const [total, data] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy: [{ featured: "desc" }, { rating: "desc" }, { name: "asc" }],
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
    ]);

    res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error("getColleges error:", error);
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
};

export const getFeaturedColleges = async (_req: Request, res: Response) => {
  try {
    const featured = await prisma.college.findMany({
      where: { featured: true },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
      take: 6,
    });

    res.json(featured);
  } catch (error) {
    console.error("getFeaturedColleges error:", error);
    res.status(500).json({ message: "Failed to fetch featured colleges" });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid college id" });
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!college) {
      return res.status(404).json({ message: "College not found" });
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
      return res.status(400).json({ message: "Provide ids query param" });
    }

    const ids = idsParam
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      return res.json([]);
    }

    const compared = await prisma.college.findMany({
      where: { id: { in: ids } },
    });

    const order = new Map(ids.map((id, index) => [id, index]));
    compared.sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
    );

    res.json(compared);
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
    console.error("getLocations error:", error);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};

export const getCourses = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.college.findMany({
      select: { courses: true },
    });

    const courses = [...new Set(rows.flatMap((r) => r.courses))].sort();

    res.json(courses);
  } catch (error) {
    console.error("getCourses error:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
