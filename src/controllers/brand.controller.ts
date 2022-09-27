import { Request, Response } from "express";
import { get } from "lodash";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
  updateBrand,
} from "../services/brand.service";
import { QueryOption } from "../utils/ApiFeatures";

export async function createBrandHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    const brand = await createBrand({ ...body });
    if (!brand) {
      return res.status(400).json({ message: "Tạo brand thất bại !" });
    }
    return res
      .status(200)
      .json({ message: "Tạo brand thành công !", data: brand });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function getAllBrandHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const brands = await getAllBrand(req.query);
    res.status(200).json({
      countDocument: brands.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function getBrandHandler(req: Request, res: Response) {
  try {
    const brand = await getBrand(get(req.params, "brandId"));
    if (!brand) {
      return res.status(404).json({ message: "Không tìm thấy brand !" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function updateBrandHandler(req: Request, res: Response) {
  try {
    const brand = await updateBrand(
      { _id: get(req.params, "brandId") },
      req.body,
      { new: true }
    );
    if (!brand) {
      return res.status(404).json({ message: "Không tìm thấy brand !" });
    }
    res.status(200).json({
      brand,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function deleteBrandHandler(req: Request, res: Response) {
  try {
    await deleteBrand(get(req.params, "catalogId"));
    res.status(200).json({
      message: "Đã xóa thương hiệu thành công !",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
