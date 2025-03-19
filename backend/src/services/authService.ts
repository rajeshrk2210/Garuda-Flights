import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

/**
 * Register a new user or admin
 */
export const registerUser = async (
  email: string,
  password: string,
  role: "user" | "admin",
  userName: string,
  userImage: string,
  dateOfBirth: Date,
  gender: "Male" | "Female" | "Other",
  nationality: string,
  phoneNumber: string,
  alternatePhoneNumber: string,
  mailingAddress: string,
  passportNumber: string,
  emergencyContactDetails: string
) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    email,
    password: hashedPassword,
    role,
    userName,
    userImage,
    dateOfBirth,
    gender,
    nationality,
    phoneNumber,
    alternatePhoneNumber,
    mailingAddress,
    passportNumber,
    emergencyContactDetails
  });

  await newUser.save();
  return newUser;
};

/**
 * Authenticate a user or admin and return a JWT token
 */
export const authenticateUser = async (email: string, inputPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // 🔹 Generate Access Token (6h) & Refresh Token (7d)
  const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "6h" });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken, user };
};
