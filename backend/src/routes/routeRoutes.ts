import { Router } from "express";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "../controllers/routeController";
import { authenticateUser, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @route   GET /admin/routes
 * @desc    Get all flight routes
 * @access  Protected (Users & Admins can view)
 */
router.get("/", authenticateUser, getRoutes);

/**
 * @route   POST /admin/routes
 * @desc    Create a new flight route (Admin only)
 * @access  Protected (Admin Only)
 */
router.post("/", authenticateUser, authorizeAdmin, createRoute);

/**
 * @route   PUT /admin/routes/:routeId
 * @desc    Update an existing route (Admin only)
 * @access  Protected (Admin Only)
 */
router.put("/:routeId", authenticateUser, authorizeAdmin, updateRoute);

/**
 * @route   DELETE /admin/routes/:routeId
 * @desc    Delete a flight route (Admin only)
 * @access  Protected (Admin Only)
 */
router.delete("/:routeId", authenticateUser, authorizeAdmin, deleteRoute);

export default router;
