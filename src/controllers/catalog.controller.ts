import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createCatalog,
  deleteCatalog,
  getAllCatalog,
  getCatalog,
  updateCatalog,
} from "../services/catalog.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function createCatalogHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const catalog = await createCatalog(req.body);
    res.json({ message: "Tạo catalog thành công !", data: catalog });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getAllCatalogHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const catalogs = await getAllCatalog(req.query);
    res.json({
      success: true,
      countDocument: catalogs.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: catalogs,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getCatalogHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const catalog = await getCatalog(get(req.params, "catalogId"));
    if (!catalog)
      return next(new HttpException(404, "Không tìm thấy catalog !"));
    res.json(catalog);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateCatalogHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const catalog = await updateCatalog(
      { _id: get(req.params, "catalogId") },
      req.body,
      { new: true }
    );
    if (!catalog)
      return next(new HttpException(404, "Không tìm thấy catalog !"));
    res.json(catalog);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteCatalogHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteCatalog(get(req.params, "catalogId"));
    res.json({
      message: "Đã xóa mục lục thành công !",
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
