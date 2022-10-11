"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const middlewares_1 = require("../middlewares");
const cart_schema_1 = require("../schemas/cart.schema");
const router = express_1.default.Router();
// GET ALL CART
router.get("/carts", cart_controller_1.getAllCartHandler);
// GET MY CART
router.get("/cart/me", middlewares_1.requiresUser, cart_controller_1.getMyCartHandler);
// GET A CART
router.get("/cart/:cartId", cart_controller_1.getCartHandler);
// ADD ITEM TO CART
router.post("/cart/add-to-cart", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(cart_schema_1.addItemToCartSchema)], cart_controller_1.addItemToCartHandler);
// UPDATE CART --- update quantity
router.put("/cart/:cartItemId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(cart_schema_1.updateCartSchema)], cart_controller_1.updateCartHandler);
// REMOVE ITEM FROM CART
router.put("/cart/remove-item-from-cart/:cartItemId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(cart_schema_1.removeItemFromCartSchema)], cart_controller_1.removeItemFromCartHandler);
// DELETE CART
router.delete("/cart/:cartId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(cart_schema_1.deleteCartSchema)], cart_controller_1.deleteCartHandler);
exports.default = router;
