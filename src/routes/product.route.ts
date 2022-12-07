import express from "express";
import {
  addFavoriteHandler,
  createProductHandler,
  deleteProductHandler,
  forceDestroyProductHandler,
  getAllProductHandler,
  getProductBySlugHandler,
  getProductHandler,
  removeFavoriteHandler,
  restoreProductHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import ProductModel from "../models/product.model";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  restoreProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
const router = express.Router();

// * CREATE PRODUCT ---- ADMIN
// POST /api/v1/admin/product/new
router.post(
  "/admin/product/new",
  [requiresAdmin, validateRequest(createProductSchema)],
  createProductHandler
);

// * GET ALL PRODUCTS
// GET /api/v1/products
/**
 * @openapi
 * '/api/v1/products':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get all products
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
router.get("/products", getAllProductHandler);

// * GET PRODUCT DETAILS BY ID
// GET /api/v1/product/:productId
/**
 * @openapi
 * '/api/v1/product/{productId}':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get a single product by the productId
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: The id of the product
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Product not found
 */
router.get(
  "/product/:productId",
  validateRequest(getProductSchema),
  getProductHandler
);
// * GET PRODUCT DETAILS BY SLUG
// GET /api/v1/product/slug/:slug
/**
 * @openapi
 * '/api/v1/product/slug/{slug}':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get a single product by the slug
 *     parameters:
 *      - name: slug
 *        in: path
 *        description: The slug of the product
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Product not found
 */
router.get("/product/slug/:slug", getProductBySlugHandler);

// * UPDATE PRODUCT ---- ADMIN
// PUT /api/v1/admin/product/:productId
router.put(
  "/admin/product/:productId",
  [requiresAdmin, validateRequest(updateProductSchema)],
  updateProductHandler
);

// * ADD FAVORITE PRODUCTS
// PUT /api/v1/products/favorite/add/:productId
router.put(
  "/products/favorite/add/:productId",
  [requiresUser, validateRequest(updateProductSchema)],
  addFavoriteHandler
);

// * REMOVE FAVORITE PRODUCTS
// PUT /api/v1/products/favorite/remove/:productId
router.put(
  "/products/favorite/remove/:productId",
  [requiresUser, validateRequest(updateProductSchema)],
  removeFavoriteHandler
);

// * RESTORE PRODUCT
// PATCH /api/v1/admin/product/restore/:productId
router.patch(
  "/admin/product/restore/:productId",
  [requiresAdmin, validateRequest(restoreProductSchema)],
  restoreProductHandler
);

// * SOFT DELETE PRODUCT
// DELETE /api/v1/admin/product/:productId
router.delete(
  "/admin/product/:productId",
  [requiresAdmin, validateRequest(deleteProductSchema)],
  deleteProductHandler
);

// * DELETE PRODUCT
// DELETE /api/v1/admin/product/force/:productId
router.delete(
  "/admin/product/force/:productId",
  [requiresAdmin, validateRequest(deleteProductSchema)],
  forceDestroyProductHandler
);
export default router;
