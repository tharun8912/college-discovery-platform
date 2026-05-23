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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.getLocations = exports.compareColleges = exports.getCollegeById = exports.getFeaturedColleges = exports.getColleges = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const parseNumber = (value) => {
    if (value === undefined || value === null || value === "")
        return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
};
const getColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { search, location, minFees, maxFees, course, featured, page, limit } = req.query;
        const pageNum = Math.max(1, (_a = parseNumber(page)) !== null && _a !== void 0 ? _a : 1);
        const limitNum = Math.min(50, Math.max(1, (_b = parseNumber(limit)) !== null && _b !== void 0 ? _b : 12));
        const skip = (pageNum - 1) * limitNum;
        const andFilters = [];
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
                fees: Object.assign(Object.assign({}, (min !== undefined ? { gte: min } : {})), (max !== undefined ? { lte: max } : {})),
            });
        }
        const where = andFilters.length > 0 ? { AND: andFilters } : {};
        const [colleges, total] = yield Promise.all([
            prisma_1.default.college.findMany({
                where,
                orderBy: [{ featured: "desc" }, { rating: "desc" }],
                skip,
                take: limitNum,
            }),
            prisma_1.default.college.count({ where }),
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
    }
    catch (error) {
        console.error("getColleges error:", error);
        res.status(500).json({ message: "Failed to fetch colleges" });
    }
});
exports.getColleges = getColleges;
const getFeaturedColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colleges = yield prisma_1.default.college.findMany({
            where: { featured: true },
            orderBy: { rating: "desc" },
            take: 6,
        });
        res.json(colleges);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch featured colleges" });
    }
});
exports.getFeaturedColleges = getFeaturedColleges;
const getCollegeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Invalid college id" });
            return;
        }
        const college = yield prisma_1.default.college.findUnique({
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
    }
    catch (error) {
        console.error("getCollegeById error:", error);
        res.status(500).json({ message: "Failed to fetch college" });
    }
});
exports.getCollegeById = getCollegeById;
const compareColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const colleges = yield prisma_1.default.college.findMany({
            where: { id: { in: ids } },
        });
        const ordered = ids
            .map((id) => colleges.find((c) => c.id === id))
            .filter((c) => Boolean(c));
        res.json(ordered);
    }
    catch (error) {
        console.error("compareColleges error:", error);
        res.status(500).json({ message: "Failed to compare colleges" });
    }
});
exports.compareColleges = compareColleges;
const getLocations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield prisma_1.default.college.findMany({
            select: { location: true },
            distinct: ["location"],
            orderBy: { location: "asc" },
        });
        res.json(rows.map((r) => r.location));
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch locations" });
    }
});
exports.getLocations = getLocations;
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield prisma_1.default.college.findMany({ select: { courses: true } });
        const set = new Set();
        rows.forEach((r) => r.courses.forEach((c) => set.add(c)));
        res.json([...set].sort());
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});
exports.getCourses = getCourses;
