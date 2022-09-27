import { Request, Response } from "express";
import {
  createProduct,
  getAllProduct,
  getProduct,
  handleFavorite,
  updateProduct,
} from "../services/product.service";
import { QueryOption } from "../utils/ApiFeatures";
import { get } from "lodash";
import { Favorite } from "../models/user.model";

export async function createProductHandler(req: Request, res: Response) {
  try {
    const product = await createProduct(req.body);
    if (!product) {
      return res
        .status(400)
        .json({ message: "Thêm sản phẩm không thành công !" });
    }
    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function getAllProductHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const product = await getAllProduct(req.query);
    res.status(200).json({
      success: true,
      countDocument: product.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function getProductHandler(req: Request, res: Response) {
  try {
    const product = await getProduct(get(req.params, "productId"));
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy product !" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function updateProductHandler(req: Request, res: Response) {
  try {
    let product = await updateProduct(get(req.params, "productId"), req.body);
    if (!product) {
      return res
        .status(400)
        .json({ message: "Cập nhật product không thành công !" });
    }
    return res.status(200).json({
      message: "Cập nhật product thành công !",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export enum ActionFavorite {
  ADD = "add",
  REMOVE = "remove",
}
export async function addFavoriteHandler(req: Request, res: Response) {
  try {
    const favorite: Favorite = get(req.body, "favorite");
    const product = await handleFavorite(
      get(req.params, "productId"),
      get(req, "user.userId"),
      ActionFavorite.ADD,
      favorite ? favorite : null
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy product !" });
    }
    return res
      .status(200)
      .json({ message: "Thêm yêu thích sản phẩm thành công !", data: product });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export async function removeFavoriteHandler(req: Request, res: Response) {
  try {
    const product = await handleFavorite(
      get(req.params, "productId"),
      get(req, "user.userId"),
      ActionFavorite.REMOVE
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy product !" });
    }
    return res
      .status(200)
      .json({ message: "Bỏ yêu thích sản phẩm thành công !", data: product });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
export async function deleteProductHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function forceDestroyProductHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function restoreProductHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
