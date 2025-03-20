import { Request, Response } from "express";
import { User } from "../models/User";
import { registerUser, authenticateUser } from "../services/authService";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

/** ✅ Register User or Admin */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received Request Body:", req.body);

    const {
      email,
      password,
      userName,
      userImage,
      dateOfBirth,
      gender,
      nationality,
      phoneNumber,
      alternatePhoneNumber,
      mailingAddress,
      passportNumber,
      emergencyContactDetails,
    } = req.body;

    let role: "admin" | "user" = req.headers["x-role"] === "admin" ? "admin" : "user";

    if (!email || !password || !userName) {
      res.status(400).json({ message: "Username, email, and password are required." });
      return;
    }

    const newUser = await registerUser(
      email,
      password,
      role,
      userName,
      userImage || "",
      dateOfBirth || "",
      gender || "",
      nationality || "",
      phoneNumber || "",
      alternatePhoneNumber || "",
      mailingAddress || "",
      passportNumber || "",
      emergencyContactDetails || ""
    );

    res.status(201).json({ message: `${role} registered successfully`, user: newUser });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(400).json({ message: error instanceof Error ? error.message : "An error occurred" });
  }
};

/** ✅ Login User & Generate Tokens */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const { accessToken, refreshToken, user } = await authenticateUser(email, password);
    res.status(200).json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(400).json({ message: error instanceof Error ? error.message : "Invalid credentials" });
  }
};

/** ✅ Get User Profile */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/** ✅ Refresh Access Token */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No refresh token provided." });
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error) {
      console.error("❌ Refresh Token Error:", error);
      res.status(401).json({ message: "Invalid or expired refresh token." });
      return;
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, JWT_SECRET, { expiresIn: "6h" });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
