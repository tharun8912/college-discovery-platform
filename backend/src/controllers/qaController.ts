import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const getQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        answers: { orderBy: { createdAt: "asc" } },
        _count: { select: { answers: true } },
      },
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discussions" });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const question = await prisma.question.findUnique({
      where: { id },
      include: { answers: { orderBy: { createdAt: "asc" } } },
    });
    if (!question) {
      res.status(404).json({ message: "Discussion not found" });
      return;
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discussion" });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, body } = req.body;
    if (!title?.trim() || !body?.trim()) {
      res.status(400).json({ message: "Title and body are required" });
      return;
    }

    const { authorName } = req.body;
    let author =
      typeof authorName === "string" && authorName.trim()
        ? authorName.trim()
        : "Anonymous";
    if (req.userId) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      author = user?.name || user?.email || author;
    }

    const question = await prisma.question.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        author,
        userId: req.userId ?? null,
      },
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to post question" });
  }
};

export const createAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const questionId = Number(req.params.id);
    const { body } = req.body;

    if (!body?.trim()) {
      res.status(400).json({ message: "Answer body is required" });
      return;
    }

    let author = "Anonymous";
    if (req.userId) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      author = user?.name || user?.email || "Student";
    }

    const answer = await prisma.answer.create({
      data: {
        questionId,
        body: body.trim(),
        author,
        userId: req.userId ?? null,
      },
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: "Failed to post answer" });
  }
};
