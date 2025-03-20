import express from "express";
import { register, login, getProfile, refreshToken } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

/** ✅ Register Route */
router.post("/register", register);

/** ✅ Login Route */
router.post("/login", login);

/** ✅ Profile Route (Protected) */
router.get("/profile", authenticateUser, getProfile);

/** ✅ Refresh Token Route */
router.post("/refresh-token", refreshToken);

export default router;
