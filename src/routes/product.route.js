import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controllers/product.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/verify.js";
const router = express.Router();
router.use(verifyJWT);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authorizeRoles(["admin"]), createProduct);
router.put("/:id", authorizeRoles(["admin"]), updateProductById);
router.delete("/:id", authorizeRoles(["admin"]), deleteProductById);

export default router;
