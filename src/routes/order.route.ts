import express from "express";
import {
  cancelOrderHandler,
  createOrderHandler,
  deleteOrderHandler,
  getAllOrderHandler,
  getMyOrderHandler,
  getOrderHandler,
  updateStatusOrderHandler,
} from "../controllers/order.controller";
import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
  cancelOrderSchema,
  createOrderSchema,
  deleteOrderSchema,
  getOrderSchema,
  updateOrderSchema,
} from "../schemas/order.schema";

const router = express.Router();

// * CREATE NEW ORDER
// POST /api/v1/order/new
router.post(
  "/order/new",
  [requiresUser, validateRequest(createOrderSchema)],
  createOrderHandler
);

// * GET MY ORDER
// GET /api/v1/order/me
router.get("/order/me", requiresUser, getMyOrderHandler);

// * GET ORDER
// GET /api/v1/order/:orderId
router.get(
  "/order/:orderId",
  [requiresUser, validateRequest(getOrderSchema)],
  getOrderHandler
);
// * GET ALL ORDER
// GET /api/v1/admin/orders
router.get("/admin/orders", requiresAdmin, getAllOrderHandler);

// * UPDATE ORDER STATUS
// PUT /api/v1/admin/order/:orderId
router.put(
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(updateOrderSchema)],
  updateStatusOrderHandler
);

// * CANCEL ORDER
// PUT /api/v1/order/cancel/:orderId
router.put(
  "/order/cancel/:orderId",
  [requiresUser, validateRequest(cancelOrderSchema)],
  cancelOrderHandler
);
// * DELETE ORDER
// DELETE /api/v1/admin/order/:orderId
router.delete(
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(deleteOrderSchema)],
  deleteOrderHandler
);
export default router;
