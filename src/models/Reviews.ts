import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const Review = models.Review || model('Review', ReviewSchema);

export default Review;
