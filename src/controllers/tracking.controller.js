import { asyncHandler } from "../utils/AsynHolder.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tracking } from "../models/tracking.model.js";
import { Product } from "../models/product.model.js";
import nodemailer from "nodemailer";

const getTrackingHistory = asyncHandler(async (req, res) => {
  const trackings = await Tracking.find({ productId: req.params.productId });
  if (!trackings) {
    throw new ApiError(404, "Tracking not found");
  }
  if (trackings.length == 0) {
    res.json(
      new ApiResponse(
        200,
        trackings,
        "Tracking history retrieved successfully but it is empty"
      )
    );
    return;
  }
  res.json(
    new ApiResponse(200, trackings, "Tracking history retrieved successfully")
  );
});

const createTrackingEntry = asyncHandler(async (req, res) => {
  const { productId, status, location } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  product.status = status;
  product.location = location;
  await product.save();

  const tracking = new Tracking({ productId, status, location });
  const newTracking = await tracking.save();

  // The email will not sent throught my account because of private tracking
  await sendEmailNotification(productId, status, location);

  res
    .status(201)
    .json(
      new ApiResponse(201, newTracking, "Tracking entry created successfully")
    );
});

const sendEmailNotification = async (productId, status, location) => {
  try {
    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Corrected email domain
        pass: process.env.EMAIL_PASS, // Never hardcode credentials, consider using environment variables
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Corrected email domain
      to: product.email, // Use the user's email from the populated product if needed
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
