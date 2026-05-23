import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./auth";

const JWT_SECRET = process.env.JWT_SECRET || "campus-compass-dev-secret";

export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET) as {
        userId: number;
      };
      req.userId = payload.userId;
    } catch {
      /* ignore invalid token */
    }
  }
  next();
};
