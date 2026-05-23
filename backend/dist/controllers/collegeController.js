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
const colleges_1 = require("../data/colleges");
function toNumber(value) {
    if (typeof value !== "string" && typeof value !== "number")
        return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function toString(value) {
    if (typeof value !== "string")
        return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function parseQuery(query) {
    var _a, _b;
    return {
        search: toString(query.search),
        location: toString(query.location),
        state: toString(query.state),
        city: toString(query.city),
        course: toString(query.course),
        exam: toString(query.exam),
        ownershipType: toString(query.ownershipType),
        minFees: toNumber(query.minFees),
        maxFees: toNumber(query.maxFees),
        minPlacement: toNumber(query.minPlacement),
        maxPlacement: toNumber(query.maxPlacement),
        minNirfRank: toNumber(query.minNirfRank),
        maxNirfRank: toNumber(query.maxNirfRank),
        sortBy: query.sortBy === "fees" ||
            query.sortBy === "placement" ||
            query.sortBy === "rating" ||
            query.sortBy === "nirfRank" ||
            query.sortBy === "name"
            ? query.sortBy
            : undefined,
        sortOrder: query.sortOrder === "asc" ? "asc" : "desc",
        page: Math.max(1, (_a = toNumber(query.page)) !== null && _a !== void 0 ? _a : 1),
        limit: Math.min(50, Math.max(1, (_b = toNumber(query.limit)) !== null && _b !== void 0 ? _b : 12)),
    };
}
function formatCollege(record) {
    var _a, _b, _c, _d;
    const ranking = (_c = (_a = record.nirfRank) !== null && _a !== void 0 ? _a : (_b = record.rankings.find((r) => r.source === "NIRF")) === null || _b === void 0 ? void 0 : _b.rank) !== null && _c !== void 0 ? _c : null;
    return Object.assign(Object.assign({}, record), { rating: record.careers360Rating, placement: record.placementPercentage, banner: (_d = record.images[0]) !== null && _d !== void 0 ? _d : record.logo, website: record.officialWebsite, ranking, acceptedExams: record.examsAccepted, faculty: record.facultyCount, students: record.studentCount, collegeType: record.ownershipType, package: {
            average: record.avgPackage,
            highest: record.highestPackage,
        } });
}
function includesText(source, term) {
    return source.toLowerCase().includes(term.toLowerCase());
}
function matchesFilters(record, filters) {
    var _a, _b;
    if (filters.search) {
        const search = filters.search.toLowerCase();
        const haystack = [
            record.name,
            record.shortName,
            record.location,
            record.state,
            record.description,
            record.detailedOverview,
            ...record.courses,
            ...record.examsAccepted,
            ...record.recruiters,
            ...record.facilities,
        ]
            .join(" ")
            .toLowerCase();
        if (!haystack.includes(search))
            return false;
    }
    if (filters.location) {
        const location = filters.location.toLowerCase();
        if (!record.location.toLowerCase().includes(location) &&
            !record.state.toLowerCase().includes(location)) {
            return false;
        }
    }
    if (filters.state && !includesText(record.state, filters.state))
        return false;
    if (filters.city && !includesText(record.location, filters.city))
        return false;
    if (filters.course) {
        const course = filters.course.toLowerCase();
        if (!record.courses.some((value) => value.toLowerCase().includes(course)))
            return false;
    }
    if (filters.exam) {
        const exam = filters.exam.toLowerCase();
        if (!record.examsAccepted.some((value) => value.toLowerCase().includes(exam)))
            return false;
    }
    if (filters.ownershipType && record.ownershipType !== filters.ownershipType)
        return false;
    if (filters.minFees != null && record.fees < filters.minFees)
        return false;
    if (filters.maxFees != null && record.fees > filters.maxFees)
        return false;
    if (filters.minPlacement != null && record.placementPercentage < filters.minPlacement)
        return false;
    if (filters.maxPlacement != null && record.placementPercentage > filters.maxPlacement)
        return false;
    if (filters.minNirfRank != null) {
        const rank = (_a = record.nirfRank) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
        if (rank > filters.minNirfRank)
            return false;
    }
    if (filters.maxNirfRank != null) {
        const rank = (_b = record.nirfRank) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
        if (rank < filters.maxNirfRank)
            return false;
    }
    return true;
}
function sortColleges(list, filters) {
    var _a, _b;
    const sortBy = (_a = filters.sortBy) !== null && _a !== void 0 ? _a : "rating";
    const sortOrder = (_b = filters.sortOrder) !== null && _b !== void 0 ? _b : "desc";
    return [...list].sort((a, b) => {
        var _a, _b;
        let diff = 0;
        switch (sortBy) {
            case "fees":
                diff = a.fees - b.fees;
                break;
            case "placement":
                diff = a.placementPercentage - b.placementPercentage;
                break;
            case "nirfRank": {
                const left = (_a = a.nirfRank) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
                const right = (_b = b.nirfRank) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
                diff = right - left;
                break;
            }
            case "name":
                diff = a.name.localeCompare(b.name);
                break;
            case "rating":
            default:
                diff = a.careers360Rating - b.careers360Rating;
                break;
        }
        return sortOrder === "asc" ? diff : -diff;
    });
}
function paginate(items, page, limit) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const data = items.slice(start, start + limit);
    return {
        data,
        pagination: {
            page: safePage,
            limit,
            total,
            totalPages,
        },
    };
}
function getFilteredColleges(query) {
    var _a, _b;
    const filters = parseQuery(query);
    const filtered = colleges_1.colleges.filter((college) => matchesFilters(college, filters));
    const sorted = sortColleges(filtered, filters);
    const paginated = paginate(sorted.map(formatCollege), (_a = filters.page) !== null && _a !== void 0 ? _a : 1, (_b = filters.limit) !== null && _b !== void 0 ? _b : 12);
    return { filters, paginated };
}
const getColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paginated } = getFilteredColleges(req.query);
    res.json(paginated);
});
exports.getColleges = getColleges;
const getFeaturedColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(colleges_1.colleges.filter((college) => college.featured).map(formatCollege));
});
exports.getFeaturedColleges = getFeaturedColleges;
const getCollegeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid college id" });
    }
    const college = colleges_1.colleges.find((item) => item.id === id);
    if (!college) {
        return res.status(404).json({
            message: "College not found",
        });
    }
    res.json(formatCollege(college));
});
exports.getCollegeById = getCollegeById;
const compareColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = typeof req.query.ids === "string"
        ? req.query.ids
            .split(",")
            .map((value) => Number(value.trim()))
            .filter((value) => Number.isInteger(value) && value > 0)
        : [];
    const compared = colleges_1.colleges
        .filter((college) => ids.includes(college.id))
        .map(formatCollege);
    res.json(compared);
});
exports.compareColleges = compareColleges;
const getLocations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = [...new Set(colleges_1.colleges.map((college) => college.location))].sort();
    res.json(locations);
});
exports.getLocations = getLocations;
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = [...new Set(colleges_1.colleges.flatMap((college) => college.courses))].sort();
    res.json(courses);
});
exports.getCourses = getCourses;
