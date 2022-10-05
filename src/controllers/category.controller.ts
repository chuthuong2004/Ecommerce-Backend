import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../services/category.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function createCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await createCategory(req.body);
    res
      .status(201)
      .json({ message: "Tạo danh mục thành công !", data: category });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getAllCategoryHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getAllCategory(req.query);
    res.json({
      countDocument: categories.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: categories,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await getCategory(get(req.params, "categoryId"));
    if (!category) {
      return next(new HttpException(404, "Không tìm thấy danh mục !"));
    }
    res.json(category);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await updateCategory(
      { _id: get(req.params, "categoryId") },
      req.body,
      { new: true }
    );
    if (!category)
      return next(new HttpException(404, "Không tìm thấy danh mục !"));
    res.json({
      message: "Cập nhật danh mục thành công !",
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteCategory(get(req.params, "categoryId"));
    res.json({
      message: "Đã xóa danh mục thành công !",
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
