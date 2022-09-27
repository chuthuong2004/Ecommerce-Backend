import express, { Request, Response } from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoryHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "../controllers/category.controller";
import { requiresAdmin, validateRequest } from "../middlewares";
import CategoryModel from "../models/category.model";
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
const router = express.Router();

// * GET ALL CATEGORY --- PAGINATION
router.get("/categories", getAllCategoryHandler);

// * GET CATEGORY DETAILS
router.get(
  "/category/:categoryId",
  validateRequest(getCategorySchema),
  getCategoryHandler
);

// * CREATE CATEGORY --- ADMIN
router.post(
  "/admin/category/new",
  [requiresAdmin, validateRequest(createCategorySchema)],
  createCategoryHandler
);

// * UPDATE CATEGORY --- ADMIN
router.put(
  "/admin/category/:categoryId",
  [requiresAdmin, validateRequest(updateCategorySchema)],
  updateCategoryHandler
);

// ! DELETE CATEGORY --- ADMIN
router.delete(
  "/admin/category/:categoryId",
  [requiresAdmin, validateRequest(deleteCategorySchema)],
  deleteCategoryHandler
);
router.get(
  "/admin/categories/update",
  requiresAdmin,
  (req: Request, res: Response) => {
    const cate = CategoryModel.findOne({ gender: ["man", "woman", "unisex"] });
    return res.status(200).json(cate);
  }
);
export default router;
