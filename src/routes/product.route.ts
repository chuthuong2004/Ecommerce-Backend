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

// * CREATE PRODUCT --- DONE
router.post(
  "/admin/product/new",
  [requiresAdmin, validateRequest(createProductSchema)],
  createProductHandler
);

router.get("/products", getAllProductHandler);

// * GET PRODUCT DETAIL --- DONE
router.get(
  "/product/:productId",
  validateRequest(getProductSchema),
  getProductHandler
);
router.get(
  "/product/slug/:slug",
  // validateRequest(getProductSchema),
  getProductBySlugHandler
);

// * UPDATE PRODUCT ---- ADMIN ---DONE
router.put(
  "/admin/product/:productId",
  [requiresAdmin, validateRequest(updateProductSchema)],
  updateProductHandler
);

// * UPDATE PRODUCTS FAVORITES
// * add favorite --- DONE
router.put(
  "/products/favorite/add/:productId",
  [requiresUser, validateRequest(updateProductSchema)],
  addFavoriteHandler
);
// * remove favorite --- DONE
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
  "/admin/product/force/:productId",
  [requiresAdmin, validateRequest(deleteProductSchema)],
  forceDestroyProductHandler
);
router.put("/updateMany", async (req, res) => {
  try {
    await ProductModel.updateMany({ gender: "woman" }, { gender: "women" });
    res.send("ok");
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
export default router;
