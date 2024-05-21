import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    location: { type: String, required: true },
    trackingNumber: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
