import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    platformCommission: { type: Number, required: true }, // 5%
    farmerAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'growing', 'harvested', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    escrowStatus: {
      type: String,
      enum: ['held', 'released', 'refunded'],
      default: 'held',
    },
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    paymentDate: Date,
    digitalPassportId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
