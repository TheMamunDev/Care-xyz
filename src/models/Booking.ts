import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    email: { type: String, required: true },
    paymentPreference: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    location: {
      division: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;
