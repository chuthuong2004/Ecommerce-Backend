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

//  CREATE NEW ORDER
router.post(
  "/order/new",
  [requiresUser, validateRequest(createOrderSchema)],
  createOrderHandler
);
// GET MY ORDER
router.get("/order/me", requiresUser, getMyOrderHandler);
// GET ORDER
router.get(
  "/order/:orderId",
  [requiresUser, validateRequest(getOrderSchema)],
  getOrderHandler
);
// GET ALL ORDER
router.get("/admin/orders", requiresAdmin, getAllOrderHandler);
// UPDATE ORDER --- design send mail
router.put(
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(updateOrderSchema)],
  updateStatusOrderHandler
);
router.put(
  "/order/cancel/:orderId",
  [requiresUser, validateRequest(cancelOrderSchema)],
  cancelOrderHandler
);
// DELETE ORDER
router.delete(
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(deleteOrderSchema)],
  deleteOrderHandler
);
export default router;
