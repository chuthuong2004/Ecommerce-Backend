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

// * CREATE CATALOG
router.post(
  "/admin/brand/new",
  [requiresAdmin, validateRequest(createBrandSchema)],
  createBrandHandler
);
// * GET ALL CATALOG --- PAGINATION
router.get("/brands", getAllBrandHandler);

// * GET CATALOG DETAILS
router.get("/brand/:brandId", validateRequest(getBrandSchema), getBrandHandler);

// * UPDATE CATALOG
router.put(
  "/admin/brand/:brandId",
  [requiresAdmin, validateRequest(updateBrandSchema)],
  updateBrandHandler
);

// * DELETE CATALOG
router.delete(
  "/admin/brand/:brandId",
  [requiresAdmin, validateRequest(deleteBrandSchema)],
  deleteBrandHandler
);

export default router;
