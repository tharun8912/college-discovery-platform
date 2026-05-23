import express from "express";
import {
  compareColleges,
  getCollegeById,
  getColleges,
  getCourses,
  getFeaturedColleges,
  getLocations,
} from "../controllers/collegeController";

const router = express.Router();

router.get("/", getColleges);
router.get("/featured", getFeaturedColleges);
router.get("/locations", getLocations);
router.get("/courses", getCourses);
router.get("/compare", compareColleges);
router.get("/:id", getCollegeById);

export default router;
