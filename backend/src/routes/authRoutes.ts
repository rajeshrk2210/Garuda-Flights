import express from "express";
import { register, login, getProfile, refreshToken, changePassword, updateProfileImage, updateProfile } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { upload } from "../utils/upload"; // already created multer config

const router = express.Router();

/** ✅ Register Route */
router.post("/register", register);

/** ✅ Login Route */
router.post("/login", login);

/** ✅ Profile Route (Protected) */
router.get("/profile", authenticateUser, getProfile);

/** ✅ Refresh Token Route */
router.post("/refresh-token", refreshToken);

router.put("/change-password", authenticateUser, changePassword);
router.post("/upload-image", authenticateUser, upload.single("image"), updateProfileImage);
router.put("/update-profile", authenticateUser, updateProfile);

export default router;
