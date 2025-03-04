import { Schema, model } from "mongoose";

const RouteSchema = new Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  distance: { type: Number, required: true },
  duration: { type: String, required: true }
});

export const Route = model("Route", RouteSchema);
