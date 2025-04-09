import mongoose, { Schema, Document, Model } from "mongoose";

// ✅ Interface
export interface IAircraft extends Document {
  aircraftNumber: string;
  aircraftModel: string;
  economySeats: number;
  premiumSeats: number;
}

// ✅ Schema
const AircraftSchema: Schema<IAircraft> = new Schema(
  {
    aircraftNumber: { type: String, required: true, unique: true, trim: true },
    aircraftModel: { type: String, required: true, trim: true },
    economySeats: { type: Number, required: true },
    premiumSeats: { type: Number, required: true },
  },
  { timestamps: true }
);

// ✅ Model
const Aircraft: Model<IAircraft> = mongoose.model<IAircraft>("Aircraft", AircraftSchema);
export default Aircraft;
