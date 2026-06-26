import mongoose from 'mongoose';

const FarmSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    region: { type: String, required: true },
    description: String,
    story: String,
    totalLand: Number, // in hectares
    images: [String],
    profileImage: String,
    organic: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    yearsOfExperience: Number,
    certificates: [{ name: String, url: String, date: Date }],
    badges: [String], // 'Organic Certified', 'Gold Organic', etc
  },
  { timestamps: true }
);

export default mongoose.models.Farm || mongoose.model('Farm', FarmSchema);
