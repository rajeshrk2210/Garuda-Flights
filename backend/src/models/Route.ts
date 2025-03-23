import mongoose, { Schema, Document, Model } from "mongoose";

// ✅ Explicitly export `IRoute`
export interface IRoute extends Document {
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: string;
}

const RouteSchema: Schema = new Schema(
  {
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Keep `Route` as default export
const Route: Model<IRoute> = mongoose.model<IRoute>("Route", RouteSchema);
export default Route;
