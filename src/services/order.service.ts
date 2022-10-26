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
import { IAddress, UserDocument } from "../models/user.model";
import { deleteCart, getCart, removeItemFromCart } from "./cart.service";
import { ICartItem } from "./../models/cart.model";
import { addAddress, getUser, updateUser } from "./user.service";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";
import sendEmail, { IPayloadMailer } from "../utils/mailer";
import { getProduct } from "./product.service";
import { ActionFavorite } from "../controllers/product.controller";
import { ISize } from "../models/product.model";

export async function createOrder(
  input: DocumentDefinition<OrderDocument>,
  listCartItemId: string[],
  userId: string
) {
  try {
    const deliveryInformation: IAddress = input.deliveryInformation;
    const isPaid = input.isPaid;
    let shippingPrice: number = input.shippingPrice;
    const [cart, user] = await Promise.all([
      getCart({ user: userId }),
      getUser({ _id: userId }),
    ]);
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

    const cartRemoved = await getCart({ user: userId });
    if (cartRemoved?.cartItems.length === 0) {
      await deleteCart(cartRemoved._id);
    }
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

    // handle update quantity product of color
    // * handle here --- DONE
    // cập nhật lại số lượng sản phẩm đã đặt (số lượng sp hiện tại trừ cho sl sp được đặt)
    updateQuantityProductOfColor(newOrder.orderItems, ActionFavorite.REMOVE);
    if (user?.addresses?.length === 0) {
      const res = await addAddress(deliveryInformation, user._id);
    }
    await sendEmail({
      email: user?.email || "",
      message: `
        <div>Xin chào quý khách ${newOrder.deliveryInformation.firstName} ${newOrder.deliveryInformation.lastName}</div>
        <div>Cảm ơn bạn đã mua hàng tại <a href="http://localhost:3000/">www.chuthuongonline.vn</a></div>
        <div>Chúng tôi xin thông báo, đơn hàng <b>${newOrder.orderId}</b> đã được tiếp nhận và đang trong quá trình xử lý.</div>

      `,
      subject: `Thông báo xác nhận đơn hàng ${newOrder.orderId}`,
    }),
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
export async function getOrder(
  filter: FilterQuery<OrderDocument>
): Promise<OrderDocument | null> {
  try {
    return await OrderModel.findOne(filter).populate({
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
    const order = await getOrder({ _id: orderId });
    if (!order)
      return {
        statusCode: 404,
        message: "Không tìm thấy đơn đặt hàng với ID trên !",
      };
    if (order.orderStatus === EOrderStatus.Delivered) {
      return {
        statusCode: 400,
        message: "Đơn hàng này đã được giao !",
      };
    }
    const isValidStatus = checkValidOrderStatus(order, orderStatus);
    if (!isValidStatus) {
      return {
        statusCode: 400,
        message: "Trạng thái cập nhật đơn hàng không hợp lệ !",
      };
    }
    let options: IPayloadMailer = {
      email: order.user.email,
      subject: "",
      message: "",
    };
    if (orderStatus === EOrderStatus.Shipping) {
      order.shippingAt = new Date();
      options.subject = "Đơn hàng tại ChuthuongOnline đang được vận chuyển";
      options.message = "Đơn hàng của bạn đang được vận chuyển ";
    }
    if (orderStatus === EOrderStatus.Delivery) {
      order.deliveryAt = new Date();
      options.subject = "Đơn hàng tại ChuthuongOnline đang giao đến bạn";
      options.message = "Đơn hàng của bạn đang giao đến bạn";
    }
    if (orderStatus == EOrderStatus.Delivered) {
      // * handle update quantitySold product --- DONE
      updateQuantitySoldProduct(order.orderItems);
      order.deliveredAt = new Date();
      order.paidAt = new Date();
      order.isPaid = true;
      options.subject = "Đơn hàng tại ChuthuongOnline đã được giao thành công";
      options.message = "Đơn hàng của bạn đã giao thành công ";
    }
    order.orderStatus = orderStatus;
    const [newOrder] = await Promise.all([
      order.save({ validateBeforeSave: false }),
      sendEmail(options),
    ]);
    return newOrder;
  } catch (error) {
    throw error;
  }
}
const checkValidOrderStatus = (
  order: OrderDocument,
  orderStatus: EOrderStatus
): boolean => {
  return (
    (order.orderStatus === EOrderStatus.Processing &&
      orderStatus === EOrderStatus.Shipping) ||
    (order.orderStatus === EOrderStatus.Shipping &&
      orderStatus === EOrderStatus.Delivery) ||
    (order.orderStatus === EOrderStatus.Delivery &&
      orderStatus === EOrderStatus.Delivered)
  );
};
const updateQuantitySoldProduct = (orderItems: IOrderItem[]): void => {
  try {
    orderItems.forEach(async (orderItem: IOrderItem) => {
      const product = await getProduct(orderItem.product);
      if (product) {
        product.quantitySold = product.quantitySold + orderItem.quantity;
        await product.save();
      }
    });
  } catch (error) {
    throw error;
  }
};
const updateQuantityProductOfColor = (
  orderItems: IOrderItem[],
  action: ActionFavorite
) => {
  orderItems.forEach(async (orderItem: IOrderItem) => {
    const product = await getProduct(orderItem.product);
    product?.colors.forEach((color) => {
      if (color.colorName === orderItem.color) {
        color.sizes.forEach((size: ISize) => {
          if (
            String(size.size).toLowerCase() ===
            String(orderItem.size).toLowerCase()
          ) {
            if (action === ActionFavorite.ADD)
              size.quantity += orderItem.quantity;
            if (action === ActionFavorite.REMOVE)
              size.quantity -= orderItem.quantity;
          }
        });
      }
    });
    await product?.save();
  });
};
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
export async function cancelOrder(
  orderId: string,
  userId: string,
  canceledReason: string
) {
  try {
    const order = await getOrder({ _id: orderId, user: userId });
    if (!order) {
      return {
        statusCode: 404,
        message: "Không tìm thấy đơn đặt hàng !",
      };
    }
    if (order.orderStatus !== EOrderStatus.Processing) {
      return {
        statusCode: 400,
        message: "Không thể hủy đơn đặt hàng, đơn hàng của bạn đã được xử lý !",
      };
    }
    let options: IPayloadMailer = {
      email: order.user.email,
      message: "",
      subject: "",
    };
    order.orderStatus = EOrderStatus.Canceled;
    order.canceledReason = canceledReason;
    order.canceledAt = new Date();
    options.subject = "Đơn hàng tại ChuthuongOnline đã được hủy thành công !";
    options.message = "Hủy đơn hàng thành công !";
    // cộng lại sl sản phẩm mua vào sl của sp
    updateQuantityProductOfColor(order.orderItems, ActionFavorite.ADD);
    await Promise.all([
      sendEmail(options),
      order.save({ validateBeforeSave: false }),
    ]);
    return { statusCode: 200, message: "Đã hủy đơn hàng thành công !" };
  } catch (error) {
    throw error;
  }
}
export async function deleteOrder(orderId: string, userId: string) {
  try {
    const order = await getOrder({ _id: orderId });
    if (!order)
      return {
        statusCode: 404,
        message: "Không tìm thấy đơn đặt hàng với ID được chỉ định !",
      };
    await Promise.all([
      updateUser({ _id: userId }, { $pull: { orders: orderId } }),
      order.remove(),
    ]);
    return {
      statusCode: 200,
      message: "Đã xóa đơn hàng thành công !",
    };
  } catch (error) {
    throw error;
  }
}
