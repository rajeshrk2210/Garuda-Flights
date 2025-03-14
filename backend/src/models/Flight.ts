import mongoose, { Schema, Document } from "mongoose";

export interface IFlight extends Document {
  aircraftNumber: string;
  route: mongoose.Schema.Types.ObjectId; // ✅ Reference to Route model
  departureDate: string;
  departureTime: string;
  economyPrice: string;
  premiumPrice: string;
  status: "OK" | "DELAYED" | "CANCELLED";
}

const FlightSchema: Schema = new Schema({
  aircraftNumber: { type: String, required: true },
  route: { type: Schema.Types.ObjectId, ref: "Route", required: true }, // ✅ Ensure reference to Route
  departureDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  economyPrice: { type: String, required: true },
  premiumPrice: { type: String, required: true },
  status: { type: String, enum: ["OK", "DELAYED", "CANCELLED"], default: "OK" }
});

export const Flight = mongoose.model<IFlight>("Flight", FlightSchema);
