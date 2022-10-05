import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
  updateBrand,
} from "../services/brand.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function createBrandHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const brand = await createBrand({ ...body });
    if (!brand) {
      return next(new HttpException(400, "Tạo brand thất bại !"));
    }
    res.json({ message: "Tạo brand thành công !", data: brand });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getAllBrandHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const brands = await getAllBrand(req.query);
    res.json({
      countDocument: brands.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: brands,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getBrandHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const brand = await getBrand(get(req.params, "brandId"));
    if (!brand) {
      return next(new HttpException(404, "Không tìm thấy brand !"));
    }
    res.json(brand);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateBrandHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const brand = await updateBrand(
      { _id: get(req.params, "brandId") },
      req.body,
      { new: true }
    );
    if (!brand) {
      next(new HttpException(404, "Không tìm thấy brand !"));
    }
    res.json(brand);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteBrandHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteBrand(get(req.params, "catalogId"));
    next(new HttpException(200, "Đã xóa thương hiệu thành công !"));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
