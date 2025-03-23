import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/** ✅ Middleware to Authenticate Users & Admins */
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];

    // ✅ Validate that header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No valid token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];

    // ✅ Check for invalid or malformed token values
    if (!token || token === "null" || token === "undefined") {
      res.status(401).json({ message: "Unauthorized: Invalid token." });
      return;
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded; // Attach user to request
    next(); // ✅ Move to next middleware or controller
  } catch (error: any) {
    console.error("❌ Token verification failed:", error);

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired. Please log in again." });
      return;
    }

    res.status(401).json({ message: "Invalid token" });
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
