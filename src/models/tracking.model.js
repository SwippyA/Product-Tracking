import mongoose, { Schema } from "mongoose";

const trackingSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    status: { type: String, required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Tracking = mongoose.model("Tracking", trackingSchema);
