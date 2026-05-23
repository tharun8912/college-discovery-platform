"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "campus-compass-dev-secret";
const optionalAuth = (req, _res, next) => {
    const header = req.headers.authorization;
    if (header === null || header === void 0 ? void 0 : header.startsWith("Bearer ")) {
        try {
            const payload = jsonwebtoken_1.default.verify(header.slice(7), JWT_SECRET);
            req.userId = payload.userId;
        }
        catch (_a) {
            /* ignore invalid token */
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
