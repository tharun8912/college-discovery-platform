"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collegeController_1 = require("../controllers/collegeController");
const router = express_1.default.Router();
router.get("/", collegeController_1.getColleges);
router.get("/featured", collegeController_1.getFeaturedColleges);
router.get("/locations", collegeController_1.getLocations);
router.get("/courses", collegeController_1.getCourses);
router.get("/compare", collegeController_1.compareColleges);
router.get("/:id", collegeController_1.getCollegeById);
exports.default = router;
