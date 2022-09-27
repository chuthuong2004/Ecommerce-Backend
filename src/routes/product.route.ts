import express from "express";
import {
  addFavoriteHandler,
  createProductHandler,
  deleteProductHandler,
  forceDestroyProductHandler,
  getAllProductHandler,
  getProductHandler,
  removeFavoriteHandler,
  restoreProductHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  restoreProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
const router = express.Router();

router.post(
  "/admin/product/new",
  [requiresAdmin, validateRequest(createProductSchema)],
  createProductHandler
);

router.get("/products", getAllProductHandler);

// * GET PRODUCT DETAIL
router.get(
  "/product/:productId",
  validateRequest(getProductSchema),
  getProductHandler
);

// * UPDATE PRODUCT ---- ADMIN
router.put(
  "/admin/product/:productId",
  [requiresAdmin, validateRequest(updateProductSchema)],
  updateProductHandler
);

// * UPDATE PRODUCTS FAVORITES
router.put(
  "/products/favorite/add/:productId",
  [requiresUser, validateRequest(updateProductSchema)],
  addFavoriteHandler
);
router.put(
  "/products/favorite/remove/:productId",
  [requiresUser, validateRequest(updateProductSchema)],
  removeFavoriteHandler
);

// * RESTORE PRODUCT
router.patch(
  "/admin/product/restore/:productId",
  [requiresAdmin, validateRequest(restoreProductSchema)],
  restoreProductHandler
);

// * SOFT DELETE PRODUCT
router.delete(
  "/admin/product/:productId",
  [requiresAdmin, validateRequest(deleteProductSchema)],
  deleteProductHandler
);

// ! DELETE PRODUCT ---- delete image
router.delete(
  "/admin/product/force/:id",
  [requiresAdmin, validateRequest(deleteProductSchema)],
  forceDestroyProductHandler
);

export default router;
