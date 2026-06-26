import mongoose from 'mongoose';

const DigitalPassportSchema = new mongoose.Schema(
  {
    passportId: { type: String, required: true, unique: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
    qrCode: String,
    blockchainHash: String, // Simulated blockchain verification
    timeline: [
      {
        stage: String,
        date: Date,
        description: String,
        images: [String],
        verifiedBy: String,
      },
    ],
    seedOrigin: String,
    waterSource: String,
    fertilizers: [String],
    inspections: [
      {
        date: Date,
        inspector: String,
        report: String,
        passed: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.DigitalPassport || mongoose.model('DigitalPassport', DigitalPassportSchema);
