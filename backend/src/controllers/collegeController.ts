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
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    logo:
      "https://upload.wikimedia.org/wikipedia/en/8/8d/IIIT_Hyderabad_Logo.png",
    website: "https://www.iiit.ac.in",
    description: "Premier research engineering institute.",
    courses: ["CSE", "ECE", "AI"],
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
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    logo:
      "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
    website: "https://www.bits-pilani.ac.in",
    description: "Top private engineering institute.",
    courses: ["CSE", "ECE", "EEE"],
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
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    logo:
      "https://vnrvjiet.ac.in/assets/images/logo.png",
    website: "https://vnrvjiet.ac.in",
    description: "Top autonomous engineering college.",
    courses: ["CSE", "IT", "ECE"],
    reviews: [],
  },
];

export const getColleges = async (
  _req: Request,
  res: Response
) => {
  res.json({
    data: colleges,
    pagination: {
      page: 1,
      limit: 12,
      total: colleges.length,
      totalPages: 1,
    },
  });
};

export const getFeaturedColleges = async (
  _req: Request,
  res: Response
) => {
  res.json(colleges.filter((c) => c.featured));
};

export const getCollegeById = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const college = colleges.find((c) => c.id === id);

  if (!college) {
    return res.status(404).json({
      message: "College not found",
    });
  }

  res.json(college);
};

export const compareColleges = async (
  req: Request,
  res: Response
) => {
  const ids =
    typeof req.query.ids === "string"
      ? req.query.ids
          .split(",")
          .map(Number)
      : [];

  const compared = colleges.filter((c) =>
    ids.includes(c.id)
  );

  res.json(compared);
};

export const getLocations = async (
  _req: Request,
  res: Response
) => {
  const locations = [
    ...new Set(colleges.map((c) => c.location)),
  ];

  res.json(locations);
};

export const getCourses = async (
  _req: Request,
  res: Response
) => {
  const courses = [
    ...new Set(colleges.flatMap((c) => c.courses)),
  ];

  res.json(courses);
};