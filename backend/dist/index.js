"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const collegeRoutes_1 = __importDefault(require("./routes/collegeRoutes"));
const predictorRoutes_1 = __importDefault(require("./routes/predictorRoutes"));
const qaRoutes_1 = __importDefault(require("./routes/qaRoutes"));
const savedRoutes_1 = __importDefault(require("./routes/savedRoutes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://college-discovery-platform-r9ktgmmol-tharun8912s-projects.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "CampusCompass API" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/colleges", collegeRoutes_1.default);
app.use("/colleges", collegeRoutes_1.default);
app.use("/api/predictor", predictorRoutes_1.default);
app.use("/api/qa", qaRoutes_1.default);
app.use("/api/saved", savedRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
