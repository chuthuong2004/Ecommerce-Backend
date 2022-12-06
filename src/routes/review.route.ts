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

// * CREATE NEW REVIEW
// POST /api/v1/review/new
router.post(
  "/review/new",
  [requiresUser, validateRequest(createReviewSchema)],
  createReviewHandler
);
// * GET ALL REVIEW
// GET /api/v1/reviews
router.get("/reviews", getAllReviewHandler);
// * GET REVIEW
// GET /api/v1/review/:reviewId
router.get(
  "/review/:reviewId",
  validateRequest(getReviewSchema),
  getReviewHandler
);
// * GET ALL REVIEW BY PRODUCT
// GET /api/v1/reviews/:productId
router.get(
  "/reviews/:productId",
  validateRequest(getAllReviewByProductSchema),
  getAllReviewByProduct
);
// * UPDATE REVIEW
// PUT /api/v1/review/:reviewId
router.put(
  "/review/:reviewId",
  [requiresUser, validateRequest(updateReviewSchema)],
  updateReviewHandler
);
// * RESTORE REVIEW
// PATCH /api/v1/review/restore/:reviewId
router.patch(
  "/review/restore/:reviewId",
  [requiresUser, validateRequest(updateReviewSchema)],
  restoreReviewHandler
);
// * SOFT DELETE REVIEW
// DELETE /api/v1/review/:reviewId
router.delete(
  "/review/:reviewId",
  [requiresUser, validateRequest(deleteReviewSchema)],
  destroyReviewHandler
);

// * FORCE DELETE REVIEW
// DELETE /api/v1/review/force/:reviewId
router.delete(
  "/review/force/:reviewId",
  [requiresUser, validateRequest(deleteReviewSchema)],
  forceDestroyReviewHandler
);
export default router;
