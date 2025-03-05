import { Request, Response } from "express";
import { User } from "../models/User";
import { registerUser, authenticateUser } from "../services/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Received Request Body:", req.body); // 🔹 Log input data

        const {
            email,
            password,
            userName,  // Ensure field names match frontend
            userImage,
            dateOfBirth,
            gender,
            nationality,
            phoneNumber,
            alternatePhoneNumber,
            mailingAddress,
            passportNumber,
            emergencyContactDetails
        } = req.body;

        let role: "admin" | "user" = "user"; // Default to "user"
        if (req.headers["x-frontend-origin"] === "admin") {
            role = "admin";
        }

        // ✅ Validate required fields
        if (!email || !password || !userName) {
            console.error("❌ Validation Failed: Missing required fields");
            res.status(400).json({ message: "Username, email, and password are required." });
            return;
        }

        // ✅ Register user (Admin or Regular User)
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

        res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`, user: newUser });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "An error occurred" });
    }
};



export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const { token, user } = await authenticateUser(email, password);
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Invalid credentials" });
    }
};

/**
 * Get user profile
 * @route GET /auth/profile
 * @access Protected (Requires JWT)
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId; // Extract userId from token

        const user = await User.findById(userId).select("-password"); // Exclude password
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
