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

// GET ALL CART
router.get("/carts", getAllCartHandler);

// GET MY CART
router.get("/cart/me", requiresUser, getMyCartHandler);

// GET A CART
router.get("/cart/:cartId", getCartHandler);

// ADD ITEM TO CART
router.post(
  "/cart/add-to-cart",
  [requiresUser, validateRequest(addItemToCartSchema)],
  addItemToCartHandler
);

// UPDATE CART --- update quantity
router.put(
  "/cart/:cartItemId",
  [requiresUser, validateRequest(updateCartSchema)],
  updateCartHandler
);

// REMOVE ITEM FROM CART
router.put(
  "/cart/remove-item-from-cart/:cartItemId",
  [requiresUser, validateRequest(removeItemFromCartSchema)],
  removeItemFromCartHandler
);

// DELETE CART
router.delete(
  "/cart/:cartId",
  [requiresAdmin, validateRequest(deleteCartSchema)],
  deleteCartHandler
);
export default router;
