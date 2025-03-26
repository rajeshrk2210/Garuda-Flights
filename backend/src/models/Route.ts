import mongoose, { Schema, Document, Model } from "mongoose";

// ✅ Interface
export interface IRoute extends Document {
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: string; // e.g., "02:45"
}

// ✅ Schema
const RouteSchema: Schema<IRoute> = new Schema(
  {
    startLocation: { type: String, required: true, trim: true },
    endLocation: { type: String, required: true, trim: true },
    distance: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Model
const Route: Model<IRoute> = mongoose.model<IRoute>("Route", RouteSchema);
export default Route;
