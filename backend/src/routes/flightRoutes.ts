import { Router } from "express";
import { getFlights, createFlight, updateFlight, deleteFlight } from "../controllers/flightController";
import { authenticateUser, authorizeAdmin } from "../middlewares/authMiddleware"; // ✅ Import authorizeAdmin

const router = Router();

/**
 * @route   GET /admin/flights
 * @desc    Get all flights (Users & Admins can view)
 * @access  Protected
 */
router.get("/", authenticateUser, getFlights);

/**
 * @route   POST /admin/flights
 * @desc    Create a new flight (Admin only)
 * @access  Protected (Admin Only)
 */
router.post("/", authenticateUser, authorizeAdmin, createFlight);

/**
 * @route   PUT /admin/flights/:flightId
 * @desc    Update flight details (Admin only)
 * @access  Protected (Admin Only)
 */
router.put("/:flightId", authenticateUser, authorizeAdmin, updateFlight);

/**
 * @route   DELETE /admin/flights/:flightId
 * @desc    Delete a flight (Admin only)
 * @access  Protected (Admin Only)
 */
router.delete("/:flightId", authenticateUser, authorizeAdmin, deleteFlight);

export default router;
