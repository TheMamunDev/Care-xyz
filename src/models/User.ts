import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: any) {
        return this.authType === 'credentials';
      },
    },
    contact: { type: String },
    nid: { type: String },
    role: { type: String, default: 'user' },
    image: { type: String },
    authType: { type: String, default: 'credentials' },
  },
  { timestamps: true },
);

const User = models.User || model('User', UserSchema);

export default User;
