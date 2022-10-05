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
import {
  createReviewHandler,
  destroyReviewHandler,
  forceDestroyReviewHandler,
  getAllReviewByProduct,
  getAllReviewHandler,
  getReviewHandler,
  restoreReviewHandler,
  updateReviewHandler,
} from "../controllers/review.controller";
import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
  cancelOrderSchema,
  createOrderSchema,
  deleteOrderSchema,
  getOrderSchema,
  updateOrderSchema,
} from "../schemas/order.schema";
import {
  createReviewSchema,
  deleteReviewSchema,
  getAllReviewByProductSchema,
  getReviewSchema,
  updateReviewSchema,
} from "../schemas/review.schema";

const router = express.Router();

//  CREATE NEW REVIEW
router.post(
  "/review/new",
  [requiresUser, validateRequest(createReviewSchema)],
  createReviewHandler
);
// GET ALL REVIEW
router.get("/reviews", getAllReviewHandler);
// GET REVIEW
router.get(
  "/review/:reviewId",
  validateRequest(getReviewSchema),
  getReviewHandler
);
// GET ALL REVIEW BY PRODUCT
router.get(
  "/reviews/:productId",
  validateRequest(getAllReviewByProductSchema),
  getAllReviewByProduct
);
// UPDATE REVIEW
router.put(
  "/review/:reviewId",
  [requiresUser, validateRequest(updateReviewSchema)],
  updateReviewHandler
);
router.patch(
  "/review/restore/:reviewId",
  [requiresUser, validateRequest(updateReviewSchema)],
  restoreReviewHandler
);
// SOFT DELETE REVIEW
router.delete(
  "/review/:reviewId",
  [requiresUser, validateRequest(deleteReviewSchema)],
  destroyReviewHandler
);
router.delete(
  "/review/force/:reviewId",
  [requiresUser, validateRequest(deleteReviewSchema)],
  forceDestroyReviewHandler
);
export default router;
