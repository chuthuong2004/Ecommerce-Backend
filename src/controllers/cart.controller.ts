import { Request, Response } from "express";
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

export async function getAllCartHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const carts = await getAllCart(req.query);
    res.json({
      countDocument: carts.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: carts,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function getCartHandler(req: Request, res: Response) {
  try {
    const cart: CartDocument | null = await getCart({
      _id: get(req.params, "cartId"),
    });
    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function getMyCartHandler(req: Request, res: Response) {
  try {
    const cart: CartDocument | null = await getCart({
      user: get(req, "user.userId"),
    });
    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function addItemToCartHandler(req: Request, res: Response) {
  try {
    const cartItem: ICartItem = {
      ...req.body,
      quantity:
        req.body.quantity && req.body.quantity > 0 ? req.body.quantity : 1,
    };
    const cart: any = await addItemToCart(cartItem, get(req, "user.userId"));
    if (!cart) {
      log.info(`Thêm `);
      return res
        .status(400)
        .json({ message: "Thêm giỏ hàng không thành công !" });
    }
    if (cart?.message) {
      return res.status(cart.statusCode).json({ message: cart.message });
    }
    return res.json({ message: "Thêm vào giỏ hàng thành công !", data: cart });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function removeItemFromCartHandler(req: Request, res: Response) {
  try {
    const cart: any = await removeItemFromCart(
      get(req, "user.userId"),
      get(req.params, "cartItemId")
    );
    if (!cart) {
      return res.status(400).json("Xóa cart item không thành công !");
    }
    if (cart.message) {
      return res.status(cart.statusCode).json({ message: cart.message });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function updateCartHandler(
  req: Request<{}, ICartItem, ICartItem, {}>,
  res: Response
) {
  try {
    const cart: any = await updateQuantityCart(
      get(req, "user.userId"),
      get(req.body, "quantity"),
      get(req.params, "cartItemId")
    );
    if (!cart) {
      return res.status(400).json({ message: "Lỗi update cart !" });
    }
    if (cart.message) {
      return res.status(cart.statusCode).json({ message: cart.message });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function deleteCartHandler(req: Request, res: Response) {
  try {
    await deleteCart(get(req.params, "cartId"));
    res.json({ message: "Xóa giỏ hàng thành công !" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
