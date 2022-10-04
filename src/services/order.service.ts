import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import OrderModel, {
  EOrderStatus,
  IOrderItem,
  OrderDocument,
} from "../models/order.model";
import { IAddress } from "../models/user.model";
import { getCart, removeItemFromCart } from "./cart.service";
import { ICartItem } from "./../models/cart.model";
import { updateUser } from "./user.service";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";

export async function createOrder(
  input: DocumentDefinition<OrderDocument>,
  listCartItemId: string[],
  userId: string
) {
  try {
    const deliveryInformation: IAddress = input.deliveryInformation;
    const isPaid = input.isPaid;
    let shippingPrice: number = input.shippingPrice;
    const cart = await getCart({ user: userId });
    if (!cart) {
      return { statusCode: 404, message: "Không tìm thấy giỏ hàng !" };
    }
    // lọc ra những cartItem được order
    const cartItems = cart.cartItems.filter((cartItem: ICartItem) =>
      listCartItemId.includes(String(cartItem._id))
    );
    if (cartItems.length == 0) {
      return { statusCode: 404, message: "Không tìm thấy cartItems !" };
    }
    let provisionalPrice: number = 0;
    const orderItems: Array<FilterQuery<IOrderItem>> = cartItems.map(
      (cartItem: ICartItem) => {
        provisionalPrice +=
          (cartItem.product.price -
            cartItem.product.price * (cartItem.product.discount / 100)) *
          cartItem.quantity;
        return {
          product: cartItem.product._id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          discount: cartItem.product.discount,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
          image: cartItem.image,
          brandName: cartItem.product.brand.name,
        };
      }
    );
    // !  handle remove item cart here --- khi có 2 item thì không xóa cart
    listCartItemId.forEach(async (itemId) => {
      await removeItemFromCart(userId, itemId);
    });
    if (!shippingPrice) {
      if (deliveryInformation.province.includes("Thành phố Hồ Chí Minh")) {
        if (deliveryInformation.ward.includes("Phường Hiệp Bình Phước"))
          shippingPrice = 0;
        else {
          shippingPrice = 10000;
        }
      } else {
        shippingPrice = 30000;
      }
    }
    const newOrder = new OrderModel({
      deliveryInformation,
      orderItems,
      user: userId,
      shippingPrice,
      provisionalPrice,
      totalPrice: shippingPrice + provisionalPrice,
    });
    if (isPaid) {
      newOrder.isPaid = true;
      newOrder.paidAt = new Date();
      newOrder.shippingPrice = 0;
      newOrder.totalPrice = provisionalPrice;
    }
    await newOrder.save();
    await updateUser({ _id: userId }, { $push: { orders: newOrder._id } });
    return newOrder;
  } catch (error) {
    throw error;
  }
}
export async function getAllOrder(
  filter: FilterQuery<OrderDocument>,
  query: QueryOption
): Promise<Array<OrderDocument>> {
  try {
    const features = new APIFeatures(
      OrderModel.find(filter).populate({
        path: "user",
        select: "_id email username isAdmin",
      }),
      query
    )
      .paginating()
      .sorting()
      .searching()
      .filtering();
    return await features.query;
  } catch (error) {
    throw error;
  }
}
export async function getOrder(orderId: string): Promise<OrderDocument | null> {
  try {
    return await OrderModel.findById(orderId).populate({
      path: "user",
      select: "_id email username isAdmin",
    });
  } catch (error) {
    throw error;
  }
}
export async function updateStatusOrder(
  orderId: string,
  orderStatus: EOrderStatus
) {
  try {
    // return awa;
  } catch (error) {
    throw error;
  }
}
export async function updateOrder(
  filter: FilterQuery<OrderDocument>,
  update: UpdateQuery<OrderDocument>,
  option?: QueryOptions<OrderDocument>
): Promise<OrderDocument | null> {
  try {
    return await OrderModel.findOneAndUpdate(filter, update, option);
  } catch (error) {
    throw error;
  }
}
