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
import { ProductDocument } from "../models/product.model";

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
    const product = await getProduct({ _id: get(req.params, "productId") });
    if (!product) {
      return next(new HttpException(404, "Không tìm thấy product !"));
    }
    res.json(product);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getProductBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await getProduct({ slug: get(req.params, "slug") });
    if (!product) {
      return next(new HttpException(404, "Không tìm thấy product !"));
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
    const product = await handleFavorite(
      get(req.params, "productId"),
      get(req, "user.userId"),
      ActionFavorite.ADD
    );
    if (!product)
      return next(new HttpException(404, "Không tìm thấy product !"));
    res.json({
      message: "Đã thêm sản phẩm vào danh sách yêu thích !",
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
    res.json({
      message: "Đã xóa sản phẩm khỏi danh sách yêu thích !",
      data: product,
    });
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
export async function searchProductHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const search = removeVietnameseTones(req.query.search?.trim() || "");
    const result = await getAllProduct({});
    const products = result.filter(
      (product: ProductDocument) =>
        removeVietnameseTones(product.name).includes(search) ||
        product.keywords?.find((word: string) =>
          removeVietnameseTones(word).includes(search)
        )
    );
    if (!search) {
      return res.json({ data: result });
    }
    res.json({ data: products });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str.toLowerCase();
};
