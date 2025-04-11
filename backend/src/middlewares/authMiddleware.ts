import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No valid token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
      res.status(401).json({ message: "Unauthorized: Invalid token." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/** ✅ Middleware to Restrict Access to Admins */
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};
