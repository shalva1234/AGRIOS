import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    availableQuantity: { type: Number, required: true }, // in kg or units
    unit: { type: String, default: 'kg' },
    pricePerUnit: { type: Number, required: true },
    season: String,
    expectedHarvestDate: Date,
    plantingDate: Date,
    images: [String],
    organic: { type: Boolean, default: false },
    tags: [String],
    growthProgress: { type: Number, default: 0 }, // 0-100%
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
