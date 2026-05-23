"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qaController_1 = require("../controllers/qaController");
const optionalAuth_1 = require("../middleware/optionalAuth");
const router = express_1.default.Router();
router.get("/", qaController_1.getQuestions);
router.get("/:id", qaController_1.getQuestionById);
router.post("/", optionalAuth_1.optionalAuth, qaController_1.createQuestion);
router.post("/:id/answers", optionalAuth_1.optionalAuth, qaController_1.createAnswer);
exports.default = router;
