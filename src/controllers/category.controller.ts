import { Request, Response } from "express";
import { get } from "lodash";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../services/category.service";
import { QueryOption } from "../utils/ApiFeatures";

export async function createCategoryHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    const category = await createCategory({ ...body });
    return res
      .status(200)
      .json({ message: "Tạo danh mục thành công !", data: category });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function getAllCategoryHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const categories = await getAllCategory(req.query);
    res.status(200).json({
      success: true,
      countDocument: categories.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function getCategoryHandler(req: Request, res: Response) {
  try {
    const category = await getCategory(get(req.params, "categoryId"));
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục !" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function updateCategoryHandler(req: Request, res: Response) {
  try {
    const category = await updateCategory(
      { _id: get(req.params, "categoryId") },
      req.body,
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục !" });
    res.status(200).json({
      message: "Cập nhật danh mục thành công !",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function deleteCategoryHandler(req: Request, res: Response) {
  try {
    await deleteCategory(get(req.params, "categoryId"));
    res.status(200).json({
      success: true,
      message: "Đã xóa danh mục thành công !",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
