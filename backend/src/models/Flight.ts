import { Schema, model } from "mongoose";

const FlightSchema = new Schema(
  {
    aircraftNumber: { type: String, required: true },
    route: {
      startLocation: { type: String, required: true },
      endLocation: { type: String, required: true },
      distance: { type: Number, required: true },
      duration: { type: String, required: true }
    },
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    status: { type: String, enum: ["OK", "DELAYED", "CANCELLED"], default: "OK" }
  },
  { timestamps: true }
);

export const Flight = model("Flight", FlightSchema);
