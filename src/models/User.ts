import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    nid: { type: String, required: true },
    role: { type: String, default: 'user' },
    image: { type: String },
  },
  { timestamps: true },
);

const User = models.User || model('User', UserSchema);

export default User;
