import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: string;
  flight: string;
  seatClass: "Economy" | "Premium";
  seatNumbers: string[];
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
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true } as any,
    flight: { type: Schema.Types.ObjectId as any, ref: "Flight", required: true },
    seatClass: { type: String, enum: ["Economy", "Premium"], required: true },
    seatNumbers: [String],
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
    price: Number,
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
