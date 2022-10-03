import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { ICartItem } from "../models/cart.model";
import { addItemToCart, getAllCart, getCart } from "../services/cart.service";
import { QueryOption } from "../utils/ApiFeatures";

export async function getAllCartHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const carts = await getAllCart(req.query);
    res.status(200).json({
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
    const cart = await getCart({ _id: get(req.params, "cartId") });
    log.info("Cart: " + cart);
    return res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function getMyCartHandler(req: Request, res: Response) {
  try {
    const cart = await getCart({ user: get(req, "user.userId") });
    log.info("Cart: " + cart);
    return res.json(cart);
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function addItemToCartHandler(req: Request, res: Response) {
  try {
    const cartItem: ICartItem = {
      ...req.body,
      quantity: req.body.quantity ? req.body.quantity : 1,
    };
    log.info("Adding cart item to cart: ", cartItem);
    const cart = await addItemToCart(cartItem, get(req, "user.userId"));
    if (!cart) {
      log.info(`Error adding cart item`);
    }
    return res.json({ message: "Thêm vào giỏ hàng thành công !", data: cart });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function removeItemFromCartHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function updateCartHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function deleteCartHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error });
  }
}
