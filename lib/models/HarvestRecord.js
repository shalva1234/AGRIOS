import mongoose from 'mongoose';

const HarvestRecordSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    crop: { type: String, required: true },
    season: { type: String, required: true },
    year: { type: Number, required: true },
    plantingDate: Date,
    harvestDate: Date,
    yieldKg: Number,
    quality: String,
    conditions: String,
    weatherNotes: String,
  },
  { timestamps: true }
);

export default mongoose.models.HarvestRecord || mongoose.model('HarvestRecord', HarvestRecordSchema);
