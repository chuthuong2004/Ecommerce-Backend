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
/**
 * @openapi
 * '/api/v1/brands':
 *  get:
 *     tags:
 *     - Brands
 *     summary: Get all brands
 *     responses:
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.get("/brands", getAllBrandHandler);

// * GET BRAND DETAILS
// GET /api/v1/brand/:brandId
/**
 * @openapi
 * '/api/v1/brand/{brandId}':
 *  get:
 *     tags:
 *     - Brands
 *     summary: Get a single brand by the brandId
 *     parameters:
 *      - name: brandId
 *        in: path
 *        description: The id of the brand
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Brand not found
 */
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
