import { Router } from "express";
import { getFlights, createFlight } from "../controllers/flightController"; // ✅ Removed updateFlight & deleteFlight
import { authenticateUser, authorizeAdmin } from "../middlewares/authMiddleware"; // ✅ Ensure correct middleware path

const router = Router();

/**
 * @route   GET /api/flights
 * @desc    Get all flights (Users & Admins can view)
 * @access  Protected
 */
router.get("/", authenticateUser, getFlights);

/**
 * @route   POST /api/flights
 * @desc    Create a new flight (Admin only)
 * @access  Protected (Admin Only)
 */
router.post("/", authenticateUser, authorizeAdmin, createFlight);

export default router;
