import express from "express";
import user from "./user.route";
import product from "./product.route";
import catalog from "./catalog.route";
import category from "./category.route";
import upload from "./upload.route";
import brand from "./brand.route";
const router = express.Router();

router.use("/api/v1", user);
router.use("/api/v1", product);
router.use("/api/v1", catalog);
router.use("/api/v1", category);
router.use("/api/v1", upload);
router.use("/api/v1", brand);
export default router;
