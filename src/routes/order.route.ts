import express from "express";
import {
  createOrderHandler,
  deleteOrderHandler,
  getAllOrderHandler,
  getMyOrderHandler,
  getOrderHandler,
  updateOrderHandler,
} from "../controllers/order.controller";
import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
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
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(getOrderSchema)],
  getOrderHandler
);
// GET ALL ORDER
router.get("/admin/orders", requiresAdmin, getAllOrderHandler);
// UPDATE ORDER --- design send mail
router.put(
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(updateOrderSchema)],
  updateOrderHandler
);
// DELETE ORDER
router.delete(
  "/admin/order/:orderId",
  [requiresAdmin, validateRequest(deleteOrderSchema)],
  deleteOrderHandler
);
export default router;
