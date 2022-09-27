import { Request, Response } from "express";
import { get } from "lodash";
import {
  createCatalog,
  deleteCatalog,
  getAllCatalog,
  getCatalog,
  updateCatalog,
} from "../services/catalog.service";
import { QueryOption } from "../utils/ApiFeatures";

export async function createCatalogHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    const catalog = await createCatalog({ ...body });
    console.log(catalog);

    return res
      .status(200)
      .json({ message: "Tạo catalog thành công !", data: catalog });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function getAllCatalogHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const catalogs = await getAllCatalog(req.query);
    res.status(200).json({
      success: true,
      countDocument: catalogs.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: catalogs,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function getCatalogHandler(req: Request, res: Response) {
  try {
    const catalog = await getCatalog(get(req.params, "catalogId"));
    if (!catalog) {
      return res.status(404).json({ message: "Không tìm thấy catalog !" });
    }
    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function updateCatalogHandler(req: Request, res: Response) {
  try {
    const catalog = await updateCatalog(
      { _id: get(req.params, "catalogId") },
      req.body,
      { new: true }
    );
    if (!catalog) {
      return res.status(404).json({ message: "Không tìm thấy catalog !" });
    }
    res.status(200).json({
      catalog,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function deleteCatalogHandler(req: Request, res: Response) {
  try {
    await deleteCatalog(get(req.params, "catalogId"));
    res.status(200).json({
      success: true,
      message: "Đã xóa mục lục thành công !",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
