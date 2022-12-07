import express, { Request, Response } from "express";
import user from "./user.route";
import product from "./product.route";
import catalog from "./catalog.route";
import category from "./category.route";
import upload from "./upload.route";
import brand from "./brand.route";
import cart from "./cart.route";
import order from "./order.route";
import review from "./review.route";
import conversation from "./conversation.route";
import message from "./message.route";
const router = express.Router();

/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/healthcheck", (req: Request, res: Response) =>
  res.sendStatus(200)
);
router.use("/api/v1", [
  user,
  product,
  catalog,
  category,
  upload,
  brand,
  cart,
  order,
  review,
  conversation,
  message,
]);
export default router;
