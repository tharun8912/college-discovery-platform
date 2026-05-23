import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  CATEGORY_KEYS,
  CATEGORY_RULES,
  admissionProbability,
  chanceLevel,
  effectiveCutoff,
} from "../lib/predictorRules";

export const getCategories = (_req: Request, res: Response) => {
  res.json(
    CATEGORY_KEYS.map((key) => ({
      id: key,
      label: CATEGORY_RULES[key].label,
      description:
        key === "GENERAL"
          ? "Open category — standard cutoffs apply"
          : `Relaxed cutoff (~${Math.round((CATEGORY_RULES[key].cutoffMultiplier - 1) * 100)}% rank buffer vs General)`,
    }))
  );
};

export const predictColleges = async (req: Request, res: Response) => {
  try {
    const { exam, rank, category } = req.body;
    const userRank = Number(rank);
    const cat =
      typeof category === "string" && CATEGORY_KEYS.includes(category)
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

    const colleges = await prisma.college.findMany({
      where: { acceptedExams: { has: exam } },
      orderBy: [{ rating: "desc" }],
    });

    const predictions = colleges
      .map((college) => {
        const baseCutoff = college.cutoffRank;
        const adjustedCutoff = effectiveCutoff(baseCutoff, cat);
        const probability = admissionProbability(userRank, adjustedCutoff);
        const level = chanceLevel(probability);

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
        if (b.probability !== a.probability) return b.probability - a.probability;
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

    const categoryLabel = CATEGORY_RULES[cat].label;

    res.json({
      exam,
      rank: userRank,
      category: cat,
      categoryLabel,
      predictions,
      summary,
      total: predictions.length,
      message:
        predictions.length > 0
          ? `Found ${predictions.length} colleges for ${exam} (Rank ${userRank.toLocaleString("en-IN")}, ${categoryLabel})`
          : `No colleges matched your profile. Try a higher rank number or browse all colleges.`,
    });
  } catch (error) {
    console.error("predictColleges error:", error);
    res.status(500).json({ message: "Prediction failed" });
  }
};

export const getExams = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.college.findMany({
      select: { acceptedExams: true },
    });
    const set = new Set<string>();
    rows.forEach((r) => r.acceptedExams.forEach((e) => set.add(e)));
    const exams = [...set].sort();
    res.json(
      exams.map((name) => ({
        id: name,
        label: name,
        popular: ["EAMCET", "JEE Main", "BITSAT", "SRMJEEE"].includes(name),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};
