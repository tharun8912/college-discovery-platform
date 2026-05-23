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
exports.deleteComparison = exports.saveComparison = exports.getSavedComparisons = exports.unsaveCollege = exports.saveCollege = exports.getSavedColleges = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getSavedColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saved = yield prisma_1.default.savedCollege.findMany({
            where: { userId: req.userId },
            include: { college: true },
            orderBy: { id: "desc" },
        });
        res.json(saved.map((s) => s.college));
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch saved colleges" });
    }
});
exports.getSavedColleges = getSavedColleges;
const saveCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collegeId = Number(req.params.collegeId);
        yield prisma_1.default.savedCollege.upsert({
            where: {
                userId_collegeId: { userId: req.userId, collegeId },
            },
            create: { userId: req.userId, collegeId },
            update: {},
        });
        res.status(201).json({ message: "College saved" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to save college" });
    }
});
exports.saveCollege = saveCollege;
const unsaveCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collegeId = Number(req.params.collegeId);
        yield prisma_1.default.savedCollege.deleteMany({
            where: { userId: req.userId, collegeId },
        });
        res.json({ message: "College removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to remove college" });
    }
});
exports.unsaveCollege = unsaveCollege;
const getSavedComparisons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma_1.default.savedComparison.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch comparisons" });
    }
});
exports.getSavedComparisons = getSavedComparisons;
const saveComparison = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, collegeIds } = req.body;
        if (!Array.isArray(collegeIds) || collegeIds.length < 2) {
            res.status(400).json({ message: "At least 2 college ids required" });
            return;
        }
        const item = yield prisma_1.default.savedComparison.create({
            data: {
                userId: req.userId,
                name: name || `Comparison ${new Date().toLocaleDateString()}`,
                collegeIds: collegeIds.map(Number),
            },
        });
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to save comparison" });
    }
});
exports.saveComparison = saveComparison;
const deleteComparison = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield prisma_1.default.savedComparison.deleteMany({
            where: { id, userId: req.userId },
        });
        res.json({ message: "Comparison deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete comparison" });
    }
});
exports.deleteComparison = deleteComparison;
