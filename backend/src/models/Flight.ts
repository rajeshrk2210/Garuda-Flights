// models/Flight.ts
import mongoose, { Document, Schema } from "mongoose";
import { IRoute } from "./Route";
import { IAircraft } from "./Aircraft";

export interface IFlight extends Document {
  route: IRoute["_id"];
  aircraftNumber: string; // ✅ Use this instead of `aircraft: IAircraft["_id"]`
  // Remove aircraft if not using ref
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  economyPrice: number;
  premiumPrice: number;
  status: "OK" | "CANCELLED" | "DELAYED";
}

const FlightSchema: Schema = new Schema({
  route: { type: Schema.Types.ObjectId, ref: "Route", required: true },
  aircraftNumber: { type: String, required: true }, // ✅ Add this
  // Remove or comment this line if not using aircraft model
  // aircraft: { type: Schema.Types.ObjectId, ref: "Aircraft", required: true },

  departureDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  economyPrice: { type: Number, required: true },
  premiumPrice: { type: Number, required: true },
  status: { type: String, enum: ["OK", "CANCELLED", "DELAYED"], default: "OK" },
});


export const Flight = mongoose.model<IFlight>("Flight", FlightSchema);
