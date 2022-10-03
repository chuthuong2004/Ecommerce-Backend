import { FilterQuery } from "mongoose";
import CartModel, { CartDocument, ICartItem } from "../models/cart.model";
import ProductModel, { IColor, ProductDocument } from "../models/product.model";
import UserModel from "../models/user.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";
import { ISize } from "./../models/product.model";

export async function getAllCart(
  query: QueryOption
): Promise<Array<CartDocument>> {
  try {
    const features = new APIFeatures(
      CartModel.find()
        .populate({
          path: "user",
          select: "_id username email isAdmin ",
        })
        .populate({
          path: "cartItems",
          populate: { path: "product", select: "_id name price discount" }, // select: '_id name price discount'
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
export async function getCart(filter: FilterQuery<CartDocument>) {
  try {
    return await CartModel.findOne(filter)
      .populate({
        path: "user",
        select: "_id username email isAdmin",
      })
      .populate({
        path: "cartItems",
        populate: { path: "product", select: "_id name price discount" },
      });
  } catch (error) {
    throw error;
  }
}
export async function addItemToCart(
  cartItem: ICartItem,
  userId: string
): Promise<CartDocument | { error: string } | null> {
  try {
    const product = await ProductModel.findById(cartItem.product);

    const image: string | undefined = findColorOfProduct(
      product?.colors,
      cartItem.color
    )?.images[0];
    cartItem = {
      ...cartItem,
      image: image ? image : "",
    };
    // tìm cart nào mà user này đã đăng nhập xem có tồn tại cart hay chưa
    const cart = await CartModel.findOne({ user: userId })
      .populate({
        path: "user",
        select: "_id username email isAdmin",
      })
      .populate({
        path: "cartItems",
        populate: {
          path: "product",
          select: "_id name price discount colors",
        },
      });
    if (cart) {
      // nếu cart tồn tại thì update số lượng product trong cart
      const item: ICartItem | undefined = cart.cartItems.find(
        (item: ICartItem) =>
          item.product._id == cartItem.product &&
          item.color == cartItem.color &&
          item.size == cartItem.size
      );
      let condition, update;

      if (item) {
        const color = findColorOfProduct(item.product.colors, cartItem.color);
        const quantityProductStock: number | undefined = color?.sizes.find(
          (size: ISize) => size.size == cartItem.size
        )?.quantity;
        if (
          quantityProductStock &&
          item.quantity + cartItem.quantity > quantityProductStock
        ) {
          return { error: "Số lượng sản phẩm không đủ !" };
        }
        condition = {
          user: userId,
          "cartItems._id": item._id,
        };
        update = {
          $set: {
            "cartItems.$.product": item.product,
            "cartItems.$.color": item.color,
            "cartItems.$.size": item.size,
            "cartItems.$.quantity": item.quantity + cartItem.quantity * 1,
          },
        };
      } else {
        condition = { user: userId };

        update = {
          $push: { cartItems: cartItem },
        };
      }
      return await CartModel.findOneAndUpdate(condition, update, {
        new: true,
      })
        .populate({
          path: "user",
          select: "_id username email isAdmin",
        })
        .populate({
          path: "cartItems",
          populate: {
            path: "product",
            select: "_id name price discount colors",
          },
        });
    } else {
      // nếu user chưa có cart thì thêm mới 1 cart cho user
      const newCart = new CartModel({
        user: userId,
        cartItems: [cartItem],
      });

      await newCart.save();
      await UserModel.findByIdAndUpdate(userId, { cart: newCart._id });

      return await CartModel.findOne({ user: userId })
        .populate({
          path: "user",
          select: "_id username email isAdmin",
        })
        .populate({
          path: "cartItems",
          populate: {
            path: "product",
            select: "_id name price discount",
          },
        });
    }
  } catch (error) {
    throw error;
  }
}
const findColorOfProduct = (
  colors: Array<IColor> | undefined,
  colorInput: string
): IColor | undefined => {
  if (!colors || colors.length === 0) return undefined;
  return colors.find(
    (color: IColor) =>
      color.colorName.toLowerCase() === colorInput.toLowerCase()
  );
};
