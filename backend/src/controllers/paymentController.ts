// controllers/paymentController.ts
import { Request, Response } from "express";
import { stripe } from "../utils/stripe";

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const { amount } = req.body;

  if (!amount || typeof amount !== "number") {
    res.status(400).json({ message: "Invalid amount" });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit (cents)
      currency: "cad",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Stripe Payment Error:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
};
