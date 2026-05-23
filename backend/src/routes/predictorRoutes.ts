import express from "express";
import {
  getCategories,
  getExams,
  predictColleges,
} from "../controllers/predictorController";

const router = express.Router();

router.get("/exams", getExams);
router.get("/categories", getCategories);
router.post("/predict", predictColleges);

export default router;
