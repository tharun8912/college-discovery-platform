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
exports.getExams = exports.predictColleges = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const predictorRules_1 = require("../lib/predictorRules");
const getCategories = (_req, res) => {
    res.json(predictorRules_1.CATEGORY_KEYS.map((key) => ({
        id: key,
        label: predictorRules_1.CATEGORY_RULES[key].label,
        description: key === "GENERAL"
            ? "Open category — standard cutoffs apply"
            : `Relaxed cutoff (~${Math.round((predictorRules_1.CATEGORY_RULES[key].cutoffMultiplier - 1) * 100)}% rank buffer vs General)`,
    })));
};
exports.getCategories = getCategories;
const predictColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exam, rank, category } = req.body;
        const userRank = Number(rank);
        const cat = typeof category === "string" && predictorRules_1.CATEGORY_KEYS.includes(category)
            ? category
            : "GENERAL";
        if (!exam || typeof exam !== "string") {
            res.status(400).json({ message: "Exam type is required" });
            return;
        }
        if (!Number.isFinite(userRank) || userRank <= 0) {
            res.status(400).json({ message: "Valid rank is required" });
            return;
        }
        const colleges = yield prisma_1.default.college.findMany({
            where: { acceptedExams: { has: exam } },
            orderBy: [{ rating: "desc" }],
        });
        const predictions = colleges
            .map((college) => {
            const baseCutoff = college.cutoffRank;
            const adjustedCutoff = (0, predictorRules_1.effectiveCutoff)(baseCutoff, cat);
            const probability = (0, predictorRules_1.admissionProbability)(userRank, adjustedCutoff);
            const level = (0, predictorRules_1.chanceLevel)(probability);
            return {
                college,
                probability,
                chanceLevel: level,
                effectiveCutoff: adjustedCutoff,
                baseCutoff,
                placement: college.placement,
                fees: college.fees,
                rating: college.rating,
            };
        })
            .filter((p) => p.probability >= 5)
            .sort((a, b) => {
            if (b.probability !== a.probability)
                return b.probability - a.probability;
            return b.rating - a.rating;
        })
            .slice(0, 20);
        const summary = {
            safe: predictions.filter((p) => p.chanceLevel === "safe").length,
            moderate: predictions.filter((p) => p.chanceLevel === "moderate").length,
            borderline: predictions.filter((p) => p.chanceLevel === "borderline").length,
            reach: predictions.filter((p) => p.chanceLevel === "reach").length,
            dream: predictions.filter((p) => p.chanceLevel === "dream").length,
        };
        const categoryLabel = predictorRules_1.CATEGORY_RULES[cat].label;
        res.json({
            exam,
            rank: userRank,
            category: cat,
            categoryLabel,
            predictions,
            summary,
            total: predictions.length,
            message: predictions.length > 0
                ? `Found ${predictions.length} colleges for ${exam} (Rank ${userRank.toLocaleString("en-IN")}, ${categoryLabel})`
                : `No colleges matched your profile. Try a higher rank number or browse all colleges.`,
        });
    }
    catch (error) {
        console.error("predictColleges error:", error);
        res.status(500).json({ message: "Prediction failed" });
    }
});
exports.predictColleges = predictColleges;
const getExams = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield prisma_1.default.college.findMany({
            select: { acceptedExams: true },
        });
        const set = new Set();
        rows.forEach((r) => r.acceptedExams.forEach((e) => set.add(e)));
        const exams = [...set].sort();
        res.json(exams.map((name) => ({
            id: name,
            label: name,
            popular: ["EAMCET", "JEE Main", "BITSAT", "SRMJEEE"].includes(name),
        })));
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch exams" });
    }
});
exports.getExams = getExams;
