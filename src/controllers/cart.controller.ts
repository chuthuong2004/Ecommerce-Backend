import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { CartDocument, ICartItem } from "../models/cart.model";
import {
  addItemToCart,
  deleteCart,
  getAllCart,
  getCart,
  removeItemFromCart,
  updateQuantityCart,
} from "../services/cart.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function getAllCartHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const carts = await getAllCart(req.query);
    res.json({
      countDocument: carts.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: carts,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart: CartDocument | null = await getCart({
      _id: get(req.params, "cartId"),
    });
    if (!cart) return next(new HttpException(404, "Không tìm thấy giỏ hàng !"));
    res.json(cart);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getMyCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart: CartDocument | null = await getCart({
      user: get(req, "user.userId"),
    });
    if (!cart) return next(new HttpException(404, "Không tìm thấy giỏ hàng !"));
    res.json(cart);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function addItemToCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cartItem: ICartItem = {
      ...req.body,
      quantity:
        req.body.quantity && req.body.quantity > 0 ? req.body.quantity : 1,
    };
    const cart: any = await addItemToCart(cartItem, get(req, "user.userId"));
    if (!cart)
      return next(new HttpException(400, "Thêm giỏ hàng không thành công !"));
    if (cart?.message)
      return next(new HttpException(cart.statusCode, cart.message));
    await cart.populate({
      path: "cartItems",
      populate: {
        path: "product",
        select: "_id name price discount colors brand slug",
        populate: { path: "brand", select: "_id name" },
      },
    });
    res.json({ message: "Thêm vào giỏ hàng thành công !", data: cart });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}

export async function removeItemFromCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart: any = await removeItemFromCart(
      get(req, "user.userId"),
      get(req.params, "cartItemId")
    );
    if (!cart)
      return next(new HttpException(400, "Xóa cart item không thành công !"));
    if (cart.message)
      return next(new HttpException(cart.statusCode, cart.message));
    await cart.populate({
      path: "cartItems",
      populate: {
        path: "product",
        select: "_id name price discount colors brand slug",
        populate: { path: "brand", select: "_id name" },
      },
    });
    res.json(cart);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateCartHandler(
  req: Request<{}, ICartItem, ICartItem, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const cart: any = await updateQuantityCart(
      get(req, "user.userId"),
      get(req.body, "quantity"),
      get(req.params, "cartItemId")
    );
    if (!cart) return next(new HttpException(400, "Lỗi update cart !"));
    if (cart.message)
      return next(new HttpException(cart.statusCode, cart.message));
    await cart.populate({
      path: "cartItems",
      populate: {
        path: "product",
        select: "_id name price discount colors brand slug",
        populate: { path: "brand", select: "_id name" },
      },
    });
    res.json(cart);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}

export async function deleteCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteCart(get(req.params, "cartId"));
    res.json({ message: "Xóa giỏ hàng thành công !" });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
