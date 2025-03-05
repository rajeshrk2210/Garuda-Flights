import mongoose, { Schema, Document, Model } from "mongoose";

interface IRoute extends Document {
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: string;
}

const RouteSchema: Schema = new Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  distance: { type: Number, required: true },
  duration: { type: String, required: true }
}, { timestamps: true });

const Route: Model<IRoute> = mongoose.model<IRoute>("Route", RouteSchema);
export default Route;
