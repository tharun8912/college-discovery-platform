"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.getLocations = exports.compareColleges = exports.getCollegeById = exports.getFeaturedColleges = exports.getColleges = void 0;
const colleges = [
    {
        id: 1,
        name: "IIIT Hyderabad",
        location: "Hyderabad",
        fees: 350000,
        rating: 4.9,
        placement: 98,
        featured: true,
        image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
        logo: "https://upload.wikimedia.org/wikipedia/en/8/8d/IIIT_Hyderabad_Logo.png",
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
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
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
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
        logo: "https://vnrvjiet.ac.in/assets/images/logo.png",
        website: "https://vnrvjiet.ac.in",
        description: "Top autonomous engineering college.",
        courses: ["CSE", "IT", "ECE"],
        reviews: [],
    },
];
const getColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        data: colleges,
        pagination: {
            page: 1,
            limit: 12,
            total: colleges.length,
            totalPages: 1,
        },
    });
});
exports.getColleges = getColleges;
const getFeaturedColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(colleges.filter((c) => c.featured));
});
exports.getFeaturedColleges = getFeaturedColleges;
const getCollegeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const college = colleges.find((c) => c.id === id);
    if (!college) {
        return res.status(404).json({
            message: "College not found",
        });
    }
    res.json(college);
});
exports.getCollegeById = getCollegeById;
const compareColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = typeof req.query.ids === "string"
        ? req.query.ids
            .split(",")
            .map(Number)
        : [];
    const compared = colleges.filter((c) => ids.includes(c.id));
    res.json(compared);
});
exports.compareColleges = compareColleges;
const getLocations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = [
        ...new Set(colleges.map((c) => c.location)),
    ];
    res.json(locations);
});
exports.getLocations = getLocations;
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = [
        ...new Set(colleges.flatMap((c) => c.courses)),
    ];
    res.json(courses);
});
exports.getCourses = getCourses;
