import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [String],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
