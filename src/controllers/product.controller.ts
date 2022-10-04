import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  forceDestroyProduct,
  getAllProduct,
  getProduct,
  handleFavorite,
  restoreProduct,
  updateProduct,
} from "../services/product.service";
import { QueryOption } from "../utils/ApiFeatures";
import { get } from "lodash";
import { IFavorite } from "../models/user.model";

// * CREATE PRODUCT --- DONE
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
// * GET ALL PRODUCT --- DONE
export async function getAllProductHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const products = await getAllProduct(req.query);
    console.log(products);

    res.status(200).json({
      countDocument: products.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
// * GET PRODUCT --- DONE
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
// * UPDATE PRODUCT --- DONE
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
    const favorite: IFavorite = get(req.body, "favorite");
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
    const deleted = await deleteProduct(req.params.productId);
    console.log("deleted: ", deleted);
    if (!deleted) {
      res.status(404).json({
        message: "Không tìm thấy product để xử lý xóa mềm !",
      });
    } else {
      res.status(200).json({
        message: "Xóa mềm thành công !",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function forceDestroyProductHandler(req: Request, res: Response) {
  try {
    const destroyProduct = await forceDestroyProduct(
      get(req.params, "productId")
    );
    if (!destroyProduct) {
      res.status(404).json({
        message: "Không tìm thấy product để xử lý xóa hẳn !",
      });
    } else {
      res.status(200).json({
        message: "Đã xóa sản phẩm thành công !",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function restoreProductHandler(req: Request, res: Response) {
  try {
    const restored = await restoreProduct(req.params.productId);
    if (!restored) {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm để khôi phục !",
      });
    } else {
      res.status(200).json({
        message: "Khôi phục sản phẩm thành công !",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
