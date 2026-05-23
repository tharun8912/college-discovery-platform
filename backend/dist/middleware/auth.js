"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "campus-compass-dev-secret";
const signToken = (userId) => jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
exports.signToken = signToken;
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!(header === null || header === void 0 ? void 0 : header.startsWith("Bearer "))) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }
    try {
        const token = header.slice(7);
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch (_a) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.requireAuth = requireAuth;
