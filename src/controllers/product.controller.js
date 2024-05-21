import { asyncHandler } from "../utils/AsynHolder.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const generateTrackingNumber = () => "TN" + Math.floor(Math.random() * 1000000);

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(new ApiResponse(200, products, "Products retrieved successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.json(new ApiResponse(200, product, "Product retrieved successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, status, location } = req.body;
  const trackingNumber = generateTrackingNumber();

  const product = new Product({ name, status, location, trackingNumber });

  const newProduct = await product.save();
  res
    .status(201)
    .json(new ApiResponse(201, newProduct, "Product created successfully"));
});

const updateProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const { name, status, location } = req.body;
  if (name) product.name = name;
  if (status) product.status = status;
  if (location) product.location = location;

  const updatedProduct = await product.save();
  res.json(
    new ApiResponse(200, updatedProduct, "Product updated successfully")
  );
});

const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  await product.remove();
  res.json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
