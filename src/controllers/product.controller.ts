import { NextFunction, Request, Response } from "express";
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
import HttpException from "../utils/httpException";

// * CREATE PRODUCT --- DONE
export async function createProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await createProduct(req.body);
    if (!product) {
      return next(new HttpException(400, "Thêm sản phẩm không thành công !"));
    }
    return res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
}
// * GET ALL PRODUCT --- DONE
export async function getAllProductHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await getAllProduct(req.query);
    res.json({
      countDocument: products.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: products,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
// * GET PRODUCT --- DONE
export async function getProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getProduct(get(req.params, "productId"));
    if (!product) {
      return next(new HttpException(400, "Không tìm thấy product !"));
    }
    res.json(product);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
// * UPDATE PRODUCT --- DONE
export async function updateProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let product = await updateProduct(get(req.params, "productId"), req.body);
    if (!product) {
      return next(
        new HttpException(400, "Không nhật product không thành công !")
      );
    }
    res.json({
      message: "Cập nhật product thành công !",
      data: product,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export enum ActionFavorite {
  ADD = "add",
  REMOVE = "remove",
}
export async function addFavoriteHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const favorite: IFavorite = get(req.body, "favorite");
    const product = await handleFavorite(
      get(req.params, "productId"),
      get(req, "user.userId"),
      ActionFavorite.ADD,
      favorite ? favorite : null
    );
    if (!product)
      return next(new HttpException(404, "Không tìm thấy product !"));
    res.json({
      message: "Thêm yêu thích sản phẩm thành công !",
      data: product,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function removeFavoriteHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await handleFavorite(
      get(req.params, "productId"),
      get(req, "user.userId"),
      ActionFavorite.REMOVE
    );

    if (!product)
      return next(new HttpException(404, "Không tìm thấy product !"));
    res.json({ message: "Bỏ yêu thích sản phẩm thành công !", data: product });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await deleteProduct(req.params.productId);
    if (!deleted)
      return next(
        new HttpException(404, "Không tìm thấy product để xử lý xóa mềm !")
      );
    res.json({
      message: "Xóa mềm thành công !",
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function forceDestroyProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destroyProduct = await forceDestroyProduct(
      get(req.params, "productId")
    );
    if (!destroyProduct)
      return next(
        new HttpException(404, "Không tìm thấy product để xử lý xóa hẳn !")
      );
    res.json({
      message: "Đã xóa sản phẩm thành công !",
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function restoreProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const restored = await restoreProduct(req.params.productId);
    if (!restored)
      return next(
        new HttpException(404, "Không tìm thấy product để khôi phục !")
      );
    res.json({
      message: "Khôi phục sản phẩm thành công !",
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
