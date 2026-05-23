"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const savedController_1 = require("../controllers/savedController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.requireAuth);
router.get("/colleges", savedController_1.getSavedColleges);
router.post("/colleges/:collegeId", savedController_1.saveCollege);
router.delete("/colleges/:collegeId", savedController_1.unsaveCollege);
router.get("/comparisons", savedController_1.getSavedComparisons);
router.post("/comparisons", savedController_1.saveComparison);
router.delete("/comparisons/:id", savedController_1.deleteComparison);
exports.default = router;
