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
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
};
function buildWhere(req) {
    var _a;
    const { search, location, state, minFees, maxFees, course, featured, minPlacement, minPlacementPercentage, minAvgPackage, maxNirfRank, ownershipType, exam, } = req.query;
    const where = {};
    if (typeof search === "string" && search.trim()) {
        const query = search.trim();
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { shortName: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } },
            { state: { contains: query, mode: "insensitive" } },
        ];
    }
    if (typeof location === "string" && location.trim() && location !== "all") {
        where.location = { equals: location.trim(), mode: "insensitive" };
    }
    if (typeof state === "string" && state.trim() && state !== "all") {
        where.state = { equals: state.trim(), mode: "insensitive" };
    }
    if (typeof course === "string" && course.trim() && course !== "all") {
        where.courses = { has: course.trim() };
    }
    if (typeof ownershipType === "string" && ownershipType.trim() && ownershipType !== "all") {
        where.ownershipType = { equals: ownershipType.trim(), mode: "insensitive" };
    }
    if (typeof exam === "string" && exam.trim() && exam !== "all") {
        where.examsAccepted = { has: exam.trim() };
    }
    if (featured === "true") {
        where.featured = true;
    }
    const min = parseNumber(minFees);
    const max = parseNumber(maxFees);
    const minPlace = (_a = parseNumber(minPlacement)) !== null && _a !== void 0 ? _a : parseNumber(minPlacementPercentage);
    const minPkg = parseNumber(minAvgPackage);
    const maxNirf = parseNumber(maxNirfRank);
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
        where.OR = [
            ...(where.OR || []),
            { placement: { gte: minPlace } },
            { placementPercentage: { gte: minPlace } },
        ];
    }
    if (minPkg !== undefined) {
        where.avgPackage = { gte: minPkg };
    }
    if (maxNirf !== undefined) {
        where.nirfRank = { lte: maxNirf };
    }
    return where;
}
const getColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const pageNum = Math.max(1, (_a = parseNumber(req.query.page)) !== null && _a !== void 0 ? _a : 1);
        const limitNum = Math.min(50, Math.max(1, (_b = parseNumber(req.query.limit)) !== null && _b !== void 0 ? _b : 12));
        const where = buildWhere(req);
        const [total, data] = yield Promise.all([
            prisma_1.default.college.count({ where }),
            prisma_1.default.college.findMany({
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
    }
    catch (error) {
        console.error("getColleges error:", error);
        res.status(500).json({ message: "Failed to fetch colleges" });
    }
});
exports.getColleges = getColleges;
const getFeaturedColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const featured = yield prisma_1.default.college.findMany({
            where: { featured: true },
            orderBy: [{ rating: "desc" }, { name: "asc" }],
            take: 6,
        });
        res.json(featured);
    }
    catch (error) {
        console.error("getFeaturedColleges error:", error);
        res.status(500).json({ message: "Failed to fetch featured colleges" });
    }
});
exports.getFeaturedColleges = getFeaturedColleges;
const getCollegeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
            return res.status(400).json({ message: "Invalid college id" });
        }
        const college = yield prisma_1.default.college.findUnique({
            where: { id },
            include: {
                reviews: { orderBy: { createdAt: "desc" } },
            },
        });
        if (!college) {
            return res.status(404).json({ message: "College not found" });
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
            return res.status(400).json({ message: "Provide ids query param" });
        }
        const ids = idsParam
            .split(",")
            .map((id) => Number(id.trim()))
            .filter((id) => Number.isFinite(id));
        if (ids.length === 0) {
            return res.json([]);
        }
        const compared = yield prisma_1.default.college.findMany({
            where: { id: { in: ids } },
        });
        const order = new Map(ids.map((id, index) => [id, index]));
        compared.sort((a, b) => { var _a, _b; return ((_a = order.get(a.id)) !== null && _a !== void 0 ? _a : 0) - ((_b = order.get(b.id)) !== null && _b !== void 0 ? _b : 0); });
        res.json(compared);
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
        console.error("getLocations error:", error);
        res.status(500).json({ message: "Failed to fetch locations" });
    }
});
exports.getLocations = getLocations;
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield prisma_1.default.college.findMany({
            select: { courses: true },
        });
        const courses = [...new Set(rows.flatMap((r) => r.courses))].sort();
        res.json(courses);
    }
    catch (error) {
        console.error("getCourses error:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});
exports.getCourses = getCourses;
