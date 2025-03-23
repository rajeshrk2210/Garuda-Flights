import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  userImage?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  mailingAddress?: string;
  passportNumber?: string;
  emergencyContactDetails?: string;
}

const UserSchema: Schema = new Schema({
  userName: { type: String, required: true, trim: true }, // ❌ Removed `unique: true`
  email: { type: String, required: true}, // ✅ Only email is unique
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  userImage: { type: String },
  dateOfBirth: { type: String, default: "" },
  gender: { type: String, default: "" },
  nationality: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  alternatePhoneNumber: { type: String, default: "" },
  mailingAddress: { type: String, default: "" },
  passportNumber: { type: String, default: "" },
  emergencyContactDetails: { type: String, default: "" },
});

// ✅ Ensure only email is unique by defining the index separately
UserSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUser>("User", UserSchema);
