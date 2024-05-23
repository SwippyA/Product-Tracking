import { asyncHandler } from "../utils/AsynHolder.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tracking } from "../models/tracking.model.js";
import { Product } from "../models/product.model.js";
import nodemailer from "nodemailer";

const getTrackingHistory = asyncHandler(async (req, res) => {
  const trackings = await Tracking.find({ productId: req.params.productId });
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

  await sendEmailNotification(productId, status, location);

  res
    .status(201)
    .json(
      new ApiResponse(201, newTracking, "Tracking entry created successfully")
    );
});

const sendEmailNotification = async (productId, status, location) => {
  const product = await Product.findById(productId).populate("User");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "youremail@gmail.com",
      pass: "yourpassword",
    },
  });

  const mailOptions = {
    from: "youremail@gmail.com",
    to: product.user.email, // Use the user's email from the populated product
    subject: "Product Status Update",
    text: `Your product with tracking number ${product.trackingNumber} is now ${status} at ${location}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export { getTrackingHistory, createTrackingEntry };
