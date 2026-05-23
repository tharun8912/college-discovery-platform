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
exports.createAnswer = exports.createQuestion = exports.getQuestionById = exports.getQuestions = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getQuestions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield prisma_1.default.question.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                answers: { orderBy: { createdAt: "asc" } },
                _count: { select: { answers: true } },
            },
        });
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch discussions" });
    }
});
exports.getQuestions = getQuestions;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const question = yield prisma_1.default.question.findUnique({
            where: { id },
            include: { answers: { orderBy: { createdAt: "asc" } } },
        });
        if (!question) {
            res.status(404).json({ message: "Discussion not found" });
            return;
        }
        res.json(question);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch discussion" });
    }
});
exports.getQuestionById = getQuestionById;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, body } = req.body;
        if (!(title === null || title === void 0 ? void 0 : title.trim()) || !(body === null || body === void 0 ? void 0 : body.trim())) {
            res.status(400).json({ message: "Title and body are required" });
            return;
        }
        const { authorName } = req.body;
        let author = typeof authorName === "string" && authorName.trim()
            ? authorName.trim()
            : "Anonymous";
        if (req.userId) {
            const user = yield prisma_1.default.user.findUnique({ where: { id: req.userId } });
            author = (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.email) || author;
        }
        const question = yield prisma_1.default.question.create({
            data: {
                title: title.trim(),
                body: body.trim(),
                author,
                userId: (_a = req.userId) !== null && _a !== void 0 ? _a : null,
            },
        });
        res.status(201).json(question);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to post question" });
    }
});
exports.createQuestion = createQuestion;
const createAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const questionId = Number(req.params.id);
        const { body } = req.body;
        if (!(body === null || body === void 0 ? void 0 : body.trim())) {
            res.status(400).json({ message: "Answer body is required" });
            return;
        }
        let author = "Anonymous";
        if (req.userId) {
            const user = yield prisma_1.default.user.findUnique({ where: { id: req.userId } });
            author = (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.email) || "Student";
        }
        const answer = yield prisma_1.default.answer.create({
            data: {
                questionId,
                body: body.trim(),
                author,
                userId: (_a = req.userId) !== null && _a !== void 0 ? _a : null,
            },
        });
        res.status(201).json(answer);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to post answer" });
    }
});
exports.createAnswer = createAnswer;
