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
const formatCollege = (college) => college;
const getColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        data: colleges_1.colleges.map(formatCollege),
        pagination: {
            page: 1,
            limit: colleges_1.colleges.length,
            total: colleges_1.colleges.length,
            totalPages: 1,
        },
    });
});
exports.getColleges = getColleges;
const getFeaturedColleges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(colleges_1.colleges
        .filter((college) => college.featured)
        .map(formatCollege));
});
exports.getFeaturedColleges = getFeaturedColleges;
const getCollegeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid college id",
        });
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
            .filter((value) => Number.isInteger(value) &&
            value > 0)
        : [];
    const compared = colleges_1.colleges
        .filter((college) => ids.includes(college.id))
        .map(formatCollege);
    res.json(compared);
});
exports.compareColleges = compareColleges;
const getLocations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = [
        ...new Set(colleges_1.colleges.map((college) => college.location)),
    ].sort();
    res.json(locations);
});
exports.getLocations = getLocations;
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = [
        ...new Set(colleges_1.colleges.flatMap((college) => { var _a; return (_a = college.courses) !== null && _a !== void 0 ? _a : []; })),
    ].sort();
    res.json(courses);
});
exports.getCourses = getCourses;
