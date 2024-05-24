import { asyncHandler } from "../utils/AsynHolder.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const generateTrackingNumber = () => "TN" + Math.floor(Math.random() * 1000000);

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (products.length === 0) {
    return res.json(new ApiResponse(200, products, "There are no products."));
  }
  res.json(new ApiResponse(200, products, "Products retrieved successfully."));
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(400, "ID is required.");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  res.json(new ApiResponse(200, product, "Product retrieved successfully."));
});

// Create new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, status, location } = req.body;
  if (![name, status, location].every(field => field && field.trim())) {
    throw new ApiError(400, "All fields (name, status, location) are required.");
  }

  const trackingNumber = generateTrackingNumber();
  const product = new Product({ name, status, location, trackingNumber });

  const newProduct = await product.save();
  res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully."));
});

// Update product by ID
const updateProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, status, location } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (name) product.name = name;
  if (status) product.status = status;
  if (location) product.location = location;

  const updatedProduct = await product.save();
  res.json(new ApiResponse(200, updatedProduct, "Product updated successfully."));
});

// Delete product by ID
const deleteProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  res.json(new ApiResponse(200, {}, "Product deleted successfully."));
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
