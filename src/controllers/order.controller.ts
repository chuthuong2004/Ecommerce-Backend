import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { OrderDocument } from "../models/order.model";
import {
  createOrder,
  getAllOrder,
  getOrder,
  updateStatusOrder,
} from "../services/order.service";
import { QueryOption } from "../utils/ApiFeatures";

export async function createOrderHandler(
  req: Request<
    {},
    OrderDocument & { cartItemsId: string[] },
    OrderDocument & { cartItemsId: string[] },
    {}
  >,
  res: Response
) {
  try {
    console.log(req.body);

    const { cartItemsId, ...orderInput } = req.body;
    const order = await createOrder(
      orderInput,
      cartItemsId,
      get(req, "user.userId")
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function getAllOrderHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const orders = await getAllOrder({}, req.query);
    console.log(orders);
    // tổng tiền tất cả đơn hàng
    const totalAmount: number = orders.reduce(
      (total: number, order: OrderDocument) => total + order.totalPrice,
      0
    );
    res.json({
      countDocument: orders.length,
      totalAmount,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function getMyOrderHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const orders = await getAllOrder(
      {
        user: get(req, "user.userId"),
      },
      req.query
    );
    console.log(orders);
    if (!orders || orders.length == 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt hàng !" });
    }
    // tổng tiền tất cả đơn hàng
    const totalAmount: number = orders.reduce(
      (total: number, order: OrderDocument) => total + order.totalPrice,
      0
    );
    res.json({
      countDocument: orders.length,
      totalAmount,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function getOrderHandler(req: Request, res: Response) {
  try {
    const order = await getOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function updateOrderHandler(req: Request, res: Response) {
  try {
    const updated = await updateStatusOrder(
      get(req.params, "orderId"),
      get(req.body, "orderStatus")
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function deleteOrderHandler(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
