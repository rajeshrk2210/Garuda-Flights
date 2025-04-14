// routes/paymentRoutes.ts
import express from "express";
import { createPaymentIntent } from "../controllers/paymentController";

const router = express.Router();

// POST /api/payments/create-payment-intent
router.post("/create-payment-intent", createPaymentIntent);

export default router;
