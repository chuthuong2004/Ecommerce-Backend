import express from "express";
import {
  createBrandHandler,
  deleteBrandHandler,
  getAllBrandHandler,
  getBrandHandler,
  updateBrandHandler,
} from "../controllers/brand.controller";
import { requiresAdmin, validateRequest } from "../middlewares";
import {
  createBrandSchema,
  deleteBrandSchema,
  getBrandSchema,
  updateBrandSchema,
} from "../schemas/brand.schema";

const router = express.Router();

// * CREATE BRAND ---- ADMIN
// POST /api/v1/admin/brand/new
router.post(
  "/admin/brand/new",
  [requiresAdmin, validateRequest(createBrandSchema)],
  createBrandHandler
);

// * GET ALL BRAND
// GET /api/v1/brands
router.get("/brands", getAllBrandHandler);

// * GET BRAND DETAILS
// GET /api/v1/brand/:brandId
router.get("/brand/:brandId", validateRequest(getBrandSchema), getBrandHandler);

// * UPDATE BRAND
// PUT /api/v1/admin/brand/:brandId
router.put(
  "/admin/brand/:brandId",
  [requiresAdmin, validateRequest(updateBrandSchema)],
  updateBrandHandler
);

// * DELETE BRAND
// DELETE /api/v1/admin/brand/:brandId
router.delete(
  "/admin/brand/:brandId",
  [requiresAdmin, validateRequest(deleteBrandSchema)],
  deleteBrandHandler
);

export default router;
