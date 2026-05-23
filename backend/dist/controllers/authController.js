"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const exists = yield prisma_1.default.user.findUnique({ where: { email } });
        if (exists) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma_1.default.user.create({
            data: { email, password: hashed, name: name || null },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        const token = (0, auth_1.signToken)(user.id);
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.error("register error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = (0, auth_1.signToken)(user.id);
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        });
    }
    catch (error) {
        console.error("login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});
exports.me = me;
