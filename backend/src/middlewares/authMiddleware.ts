import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

// Middleware to authenticate user
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // Attach user details to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is an admin
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || typeof req.user === "string" || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};
