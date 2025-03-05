import { Schema, model } from "mongoose";

const FlightSchema = new Schema(
  {
    aircraftNumber: { type: String, required: true },
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true }, // ✅ Store Route ID instead
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    economyPrice: { type: Number, required: true }, // ✅ Economy price added
    premiumPrice: { type: Number, required: true }, // ✅ Premium price added
    status: { type: String, enum: ["OK", "DELAYED", "CANCELLED"], default: "OK" }
  },
  { timestamps: true }
);

export const Flight = model("Flight", FlightSchema);
