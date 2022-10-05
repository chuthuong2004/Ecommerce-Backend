import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { OrderDocument } from "../models/order.model";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrder,
  getOrder,
  updateStatusOrder,
} from "../services/order.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function createOrderHandler(
  req: Request<
    {},
    OrderDocument & { cartItemsId: string[] },
    OrderDocument & { cartItemsId: string[] },
    {}
  >,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body);

    const { cartItemsId, ...orderInput } = req.body;
    const order = await createOrder(
      orderInput,
      cartItemsId,
      get(req, "user.userId")
    );
    res.status(201).json(order);
  } catch (error: any) {
    next(new HttpException(404, error.message));
  }
}
export async function getAllOrderHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
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
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getMyOrderHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
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
      next(new HttpException(404, "Không tìm thấy đơn đặt hàng !"));
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
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await getOrder({ _id: req.params.orderId });
    if (!order) {
      return next(new HttpException(404, "Không tìm thấy đơn hàng !"));
    }
    res.json(order);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateStatusOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updated: any = await updateStatusOrder(
      get(req.params, "orderId"),
      get(req.body, "orderStatus")
    );
    if (updated.message) {
      return next(new HttpException(updated.statusCode, updated.message));
    }
    res.json(updated);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function cancelOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const canceledReason = req.body.canceledReason;
    const canceledOrder = await cancelOrder(
      get(req.params, "orderId"),
      get(req, "user.userId"),
      canceledReason
    );
    next(new HttpException(canceledOrder.statusCode, canceledOrder.message));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await deleteOrder(
      get(req.params, "orderId"),
      get(req, "user.userId")
    );
    next(new HttpException(deleted.statusCode, deleted.message));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
