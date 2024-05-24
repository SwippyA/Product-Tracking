import express from "express";
import {
  getTrackingHistory,
  createTrackingEntry,
} from "../controllers/tracking.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/verify.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/:productId", getTrackingHistory);
router.post("/",authorizeRoles(["admin"]), createTrackingEntry);

export default router;
