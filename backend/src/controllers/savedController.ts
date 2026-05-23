import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const getSavedColleges = async (req: AuthRequest, res: Response) => {
  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.userId! },
      include: { college: true },
      orderBy: { id: "desc" },
    });
    res.json(saved.map((s) => s.college));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved colleges" });
  }
};

export const saveCollege = async (req: AuthRequest, res: Response) => {
  try {
    const collegeId = Number(req.params.collegeId);
    await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: { userId: req.userId!, collegeId },
      },
      create: { userId: req.userId!, collegeId },
      update: {},
    });
    res.status(201).json({ message: "College saved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save college" });
  }
};

export const unsaveCollege = async (req: AuthRequest, res: Response) => {
  try {
    const collegeId = Number(req.params.collegeId);
    await prisma.savedCollege.deleteMany({
      where: { userId: req.userId!, collegeId },
    });
    res.json({ message: "College removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove college" });
  }
};

export const getSavedComparisons = async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.savedComparison.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comparisons" });
  }
};

export const saveComparison = async (req: AuthRequest, res: Response) => {
  try {
    const { name, collegeIds } = req.body;
    if (!Array.isArray(collegeIds) || collegeIds.length < 2) {
      res.status(400).json({ message: "At least 2 college ids required" });
      return;
    }

    const item = await prisma.savedComparison.create({
      data: {
        userId: req.userId!,
        name: name || `Comparison ${new Date().toLocaleDateString()}`,
        collegeIds: collegeIds.map(Number),
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to save comparison" });
  }
};

export const deleteComparison = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.savedComparison.deleteMany({
      where: { id, userId: req.userId! },
    });
    res.json({ message: "Comparison deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comparison" });
  }
};
