"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const predictorController_1 = require("../controllers/predictorController");
const router = express_1.default.Router();
router.get("/exams", predictorController_1.getExams);
router.get("/categories", predictorController_1.getCategories);
router.post("/predict", predictorController_1.predictColleges);
exports.default = router;
