import mongoose, { Schema, Document, Model } from "mongoose";

// Define Aircraft Interface
export interface IAircraft extends Document {
  aircraftNumber: string;
  aircraftModel: string; // ✅ Ensure 'aircraftModel' is used
  economySeats: number;
  premiumSeats: number;
}

// Define Aircraft Schema
const AircraftSchema: Schema = new Schema({
  aircraftNumber: { type: String, required: true, unique: true },
  aircraftModel: { type: String, required: true }, // ✅ Ensure correct naming
  economySeats: { type: Number, required: true },
  premiumSeats: { type: Number, required: true },
});

// Create Model
const Aircraft: Model<IAircraft> = mongoose.model<IAircraft>("Aircraft", AircraftSchema);

export default Aircraft;
