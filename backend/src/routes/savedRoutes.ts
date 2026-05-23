import express from "express";
import {
  deleteComparison,
  getSavedColleges,
  getSavedComparisons,
  saveCollege,
  saveComparison,
  unsaveCollege,
} from "../controllers/savedController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.use(requireAuth);

router.get("/colleges", getSavedColleges);
router.post("/colleges/:collegeId", saveCollege);
router.delete("/colleges/:collegeId", unsaveCollege);
router.get("/comparisons", getSavedComparisons);
router.post("/comparisons", saveComparison);
router.delete("/comparisons/:id", deleteComparison);

export default router;
