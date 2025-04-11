import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  flights: string[]; // One or two flight IDs
  pnr: string;
  seatClass: "Economy" | "Premium";
  seatAssignments: {
    flight: string;        // Flight ID
    seatNumbers: string[]; // Seat numbers for this flight
  }[];
  passengers: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
  }[];
  contactDetails: {
    contactPerson: string;
    country: string;
    mobile: string;
    email: string;
  };
  price: number;
  status: "CONFIRMED" | "CANCELLED";
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    flights: [{ type: Schema.Types.ObjectId, ref: "Flight", required: true }],
    pnr: { type: String, required: true, unique: true },
    seatClass: { type: String, enum: ["Economy", "Premium"], required: true },
    seatAssignments: [
      {
        flight: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
        seatNumbers: [{ type: String }],
      },
    ],
    passengers: [
      {
        firstName: String,
        lastName: String,
        gender: String,
        dateOfBirth: String,
      },
    ],
    contactDetails: {
      contactPerson: String,
      country: String,
      mobile: String,
      email: String,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;