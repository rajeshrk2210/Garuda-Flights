import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
  },
  { timestamps: true }
);

const User = model('User', userSchema);
export default User;