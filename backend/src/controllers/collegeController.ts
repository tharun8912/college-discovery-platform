import { Request, Response } from "express";

const colleges = [
  {
    id: 1,
    name: "IIIT Hyderabad",
    location: "Hyderabad",
    fees: 350000,
    rating: 4.9,
    placement: 98,
    featured: true,
    courses: ["CSE", "ECE"],
    description: "Top engineering institute in Hyderabad",
    reviews: [],
  },
  {
    id: 2,
    name: "BITS Pilani Hyderabad",
    location: "Hyderabad",
    fees: 420000,
    rating: 4.8,
    placement: 96,
    featured: true,
    courses: ["CSE", "EEE"],
    description: "Premier private engineering college",
    reviews: [],
  },
  {
    id: 3,
    name: "VNR VJIET",
    location: "Hyderabad",
    fees: 140000,
    rating: 4.5,
    placement: 92,
    featured: true,
    courses: ["CSE", "IT"],
    description: "Well-known autonomous engineering college",
    reviews: [],
  },
];

const parseNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const num = Number(value);

  return Number.isFinite(num) ? num : undefined;
};

export const getColleges = async (req: Request, res: Response) => {
  try {
    const {
      search,
      location,
      minFees,
      maxFees,
      course,
      featured,
      page,
      limit,
    } = req.query;

    const pageNum = Math.max(1, parseNumber(page) ?? 1);
    const limitNum = Math.min(50, Math.max(1, parseNumber(limit) ?? 12));

    let filtered = [...colleges];

    // Search
    if (typeof search === "string" && search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter(
        (college) =>
          college.name.toLowerCase().includes(query) ||
          college.location.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (
      typeof location === "string" &&
      location.trim() &&
      location !== "all"
    ) {
      filtered = filtered.filter(
        (college) =>
          college.location.toLowerCase() === location.toLowerCase()
      );
    }

    // Course filter
    if (
      typeof course === "string" &&
      course.trim() &&
      course !== "all"
    ) {
      filtered = filtered.filter((college) =>
        college.courses.includes(course)
      );
    }

    // Featured
    if (featured === "true") {
      filtered = filtered.filter((college) => college.featured);
    }

    // Fees filter
    const min = parseNumber(minFees);
    const max = parseNumber(maxFees);

    if (min !== undefined) {
      filtered = filtered.filter((college) => college.fees >= min);
    }

    if (max !== undefined) {
      filtered = filtered.filter((college) => college.fees <= max);
    }

    const total = filtered.length;

    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    const paginated = filtered.slice(start, end);

    res.json({
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("getColleges error:", error);

    res.status(500).json({
      message: "Failed to fetch colleges",
    });
  }
};

export const getFeaturedColleges = async (
  _req: Request,
  res: Response
) => {
  try {
    const featured = colleges.filter((c) => c.featured);

    res.json(featured);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch featured colleges",
    });
  }
};

export const getCollegeById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const college = colleges.find((c) => c.id === id);

    if (!college) {
      return res.status(404).json({
        message: "College not found",
      });
    }

    res.json(college);
  } catch (error) {
    console.error("getCollegeById error:", error);

    res.status(500).json({
      message: "Failed to fetch college",
    });
  }
};

export const compareColleges = async (
  req: Request,
  res: Response
) => {
  try {
    const idsParam = req.query.ids;

    if (typeof idsParam !== "string") {
      return res.status(400).json({
        message: "Provide ids query param",
      });
    }

    const ids = idsParam
      .split(",")
      .map((id) => Number(id));

    const compared = colleges.filter((college) =>
      ids.includes(college.id)
    );

    res.json(compared);
  } catch (error) {
    console.error("compareColleges error:", error);

    res.status(500).json({
      message: "Failed to compare colleges",
    });
  }
};

export const getLocations = async (
  _req: Request,
  res: Response
) => {
  try {
    const locations = [
      ...new Set(colleges.map((c) => c.location)),
    ];

    res.json(locations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch locations",
    });
  }
};

export const getCourses = async (
  _req: Request,
  res: Response
) => {
  try {
    const courses = [
      ...new Set(
        colleges.flatMap((college) => college.courses)
      ),
    ];

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};