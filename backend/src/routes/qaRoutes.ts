import express from "express";
import {
  createAnswer,
  createQuestion,
  getQuestionById,
  getQuestions,
} from "../controllers/qaController";
import { optionalAuth } from "../middleware/optionalAuth";

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", optionalAuth, createQuestion);
router.post("/:id/answers", optionalAuth, createAnswer);

export default router;
