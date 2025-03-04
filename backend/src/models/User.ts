import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    // User Profile Image
    userImage: { type: String, default: "" },

    // Basic Information
    userName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    nationality: { type: String, required: true },

    // Contact Details
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    alternatePhoneNumber: { type: String },
    mailingAddress: { type: String },

    // Identity & Verification
    passportNumber: { type: String },
    emergencyContactDetails: { type: String },

    // Security & Account Settings
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true }
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
