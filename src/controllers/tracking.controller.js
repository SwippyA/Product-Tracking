import { asyncHandler } from "../utils/AsynHolder.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tracking } from "../models/tracking.model.js";
import { Product } from "../models/product.model.js";
import nodemailer from "nodemailer";

// Get tracking history for a product
const getTrackingHistory = asyncHandler(async (req, res) => {
  const trackings = await Tracking.find({ productId: req.params.productId });
  if (!trackings || trackings.length === 0) {
    return res.json(
      new ApiResponse(
        200,
        trackings,
        "Tracking history retrieved successfully but it is empty"
      )
    );
  }
  res.json(
    new ApiResponse(200, trackings, "Tracking history retrieved successfully")
  );
});

// Create a new tracking entry
const createTrackingEntry = asyncHandler(async (req, res) => {
  const { productId, status, location } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.status = status;
  product.location = location;
  await product.save();

  const tracking = new Tracking({ productId, status, location });
  const newTracking = await tracking.save();

  // Send email notification
  await sendEmailNotification(productId, status, location);

  res.status(201).json(
    new ApiResponse(201, newTracking, "Tracking entry created successfully")
  );
});

// Send email notification
const sendEmailNotification = async (productId, status, location) => {
  try {
    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Ensure the product has an email field
    if (!product.email) {
      console.warn(`Product ${productId} does not have an email address.`);
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables for credentials
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: product.email, // Ensure the email field is populated
      subject: "Product Status Update",
      text: `Your product with tracking number ${product.trackingNumber} is now ${status} at ${location}.`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { getTrackingHistory, createTrackingEntry };
