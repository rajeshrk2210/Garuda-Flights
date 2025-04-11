import express from "express";
import { createBooking, getUserBookings, cancelBooking } from "../controllers/bookingController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// 🔐 Protected route to create a booking
router.post("/", authenticateUser, createBooking);

// 🛎️ In the future, you can add:
router.get("/my-bookings", authenticateUser, getUserBookings);

// Cancel a booking
router.patch("/cancel/:id", authenticateUser, cancelBooking);

export default router;
