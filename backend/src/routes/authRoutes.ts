import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateUser, getProfile); // Protected route

export default router;
