import { Router } from "express";
import {
    getFlights,
    createFlight,
    updateFlight,
    getFlightById,
    getFlightStats,
    searchFlights, // ✅ Import this
  } from "../controllers/flightController";
import { authenticateUser, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

/**
 * ✅ Place static routes first
 */
router.get("/stats", authenticateUser, authorizeAdmin, getFlightStats);
router.get("/search", authenticateUser, searchFlights); // ✅ Add this before `/:id`

/**
 * @route   GET /api/flights
 * @desc    Get all flights (Users & Admins can view)
 * @access  Protected
 */
router.get("/", authenticateUser, getFlights);

/**
 * @route   GET /api/flights/:id
 * @desc    Get a flight by ID (Users & Admins)
 * @access  Protected
 */
router.get("/:id", authenticateUser, getFlightById);

/**
 * @route   POST /api/flights
 * @desc    Create a new flight (Admin only)
 * @access  Protected (Admin Only)
 */
router.post("/", authenticateUser, authorizeAdmin, createFlight);

/**
 * @route   PUT /api/flights/:id
 * @desc    Update a flight (Admin only)
 * @access  Protected (Admin Only)
 */
router.put("/:id", authenticateUser, authorizeAdmin, updateFlight);

export default router;