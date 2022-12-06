import express from "express";
import {
  addItemToCartHandler,
  deleteCartHandler,
  getAllCartHandler,
  getCartHandler,
  getMyCartHandler,
  removeItemFromCartHandler,
  updateCartHandler,
} from "../controllers/cart.controller";
import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
  addItemToCartSchema,
  deleteCartSchema,
  removeItemFromCartSchema,
  updateCartSchema,
} from "../schemas/cart.schema";
const router = express.Router();

// * GET ALL CART
// GET /api/v1/carts
router.get("/carts", getAllCartHandler);

// * GET MY CART
// GET /api/v1/cart/me
router.get("/cart/me", requiresUser, getMyCartHandler);

// * GET A CART
// GET /api/v1/cart/:cartId
router.get("/cart/:cartId", getCartHandler);

// * ADD ITEM TO CART
// POST /api/v1/cart/add-to-cart
router.post(
  "/cart/add-to-cart",
  [requiresUser, validateRequest(addItemToCartSchema)],
  addItemToCartHandler
);

// UPDATE CART --- update quantity
// PUT /api/v1/cart/:cartItemId
router.put(
  "/cart/:cartItemId",
  [requiresUser, validateRequest(updateCartSchema)],
  updateCartHandler
);

// REMOVE ITEM FROM CART
// PUT /api/v1/cart/remove-item-from-cart/:cartItemId
router.put(
  "/cart/remove-item-from-cart/:cartItemId",
  [requiresUser, validateRequest(removeItemFromCartSchema)],
  removeItemFromCartHandler
);

// DELETE CART
// DELETE /api/v1/cart/:cartItemId
router.delete(
  "/cart/:cartId",
  [requiresAdmin, validateRequest(deleteCartSchema)],
  deleteCartHandler
);
export default router;
