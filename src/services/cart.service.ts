import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CartModel, { CartDocument, ICartItem } from "../models/cart.model";
import ProductModel, { IColor, ProductDocument } from "../models/product.model";
import UserModel from "../models/user.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";
import { ISize } from "./../models/product.model";
import { updateUser } from "./user.service";

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
        populate: {
          path: "product",
          select: "_id name price discount colors brand slug",
          populate: { path: "brand", select: "_id name" },
        },
      });
  } catch (error) {
    throw error;
  }
}
export async function createCart(
  userId: string,
  cartItem: ICartItem
): Promise<CartDocument | null> {
  try {
    const newCart = new CartModel({
      user: userId,
      cartItems: [cartItem],
    });
    await newCart.save(); // create new cart
    await updateUser({ _id: userId }, { cart: newCart._id }); // add cart id cho user
    return await getCart({ user: userId });
  } catch (error) {
    throw error;
  }
}
export async function updateCart(
  filter: FilterQuery<CartDocument>,
  update: UpdateQuery<CartDocument>,
  options?: QueryOptions<CartDocument>
) {
  try {
    return await CartModel.findOneAndUpdate(filter, update, options)
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
  } catch (error) {
    throw error;
  }
}
export async function addItemToCart(
  cartItem: ICartItem,
  userId: string
): Promise<CartDocument | { statusCode: number; message: string } | null> {
  try {
    const product = await ProductModel.findById(cartItem.product);

    // get image product dựa vào màu của product
    const image: string | undefined = findColorOfProduct(
      product?.colors,
      cartItem.color
    )?.images[0];
    cartItem = {
      ...cartItem,
      image: image ? image : "",
    };
    // tìm cart nào mà user này đã đăng nhập xem có tồn tại cart hay chưa
    const cart: CartDocument | null = await getCart({ user: userId });
    if (!cart) {
      // nếu user chưa có cart thì thêm mới 1 cart cho user
      return await createCart(userId, cartItem);
    }
    // nếu cart tồn tại thì update số lượng product trong cart
    return await handleUpdateCart(cart, userId, cartItem);
  } catch (error) {
    throw error;
  }
}
export async function removeItemFromCart(
  userId: string,
  cartItemId: string
): Promise<CartDocument | null | { statusCode: number; message: string }> {
  try {
    const cart = await getCart({ user: userId });
    if (!cart) return { statusCode: 404, message: "Cart not found" };
    const cartItem: ICartItem | undefined = findCartItemById(
      cart.cartItems,
      cartItemId
    );
    if (!cartItem) {
      return { statusCode: 404, message: "CartItem not found" };
    }
    // nếu cart chỉ có 1 item thì xóa luôn cart
    if (cart.cartItems.length == 1) {
      await deleteCart(cart._id);
      return { statusCode: 200, message: "Đã xóa giỏ hàng thành công !" };
    }
    // nếu cart có nhiều item thì xóa item ra khỏi cart
    const filter: FilterQuery<CartDocument> = {
      user: userId,
      "cartItems._id": cartItem._id,
    };
    const update: UpdateQuery<CartDocument> = {
      $pull: { cartItems: { _id: cartItem._id } },
    };
    return await updateCart(filter, update, { new: true });
  } catch (error) {
    throw error;
  }
}
export async function updateQuantityCart(
  userId: string,
  quantityUpdate: number,
  cartItemId: string
): Promise<CartDocument | null | { statusCode: number; message: string }> {
  try {
    const cart: CartDocument | null = await getCart({ user: userId });
    if (!cart) {
      return { statusCode: 404, message: "Không tìm thấy giỏ hàng của bạn !" };
    }
    const cartItem: ICartItem | undefined = findCartItemById(
      cart.cartItems,
      cartItemId
    );
    if (!cartItem) {
      return { statusCode: 404, message: "CartItem not found" };
    }
    const quantityStock = quantityProductStock(cartItem, {
      color: cartItem.color,
      size: cartItem.size,
      quantity: cartItem.quantity,
    });
    if (quantityStock && quantityUpdate > quantityStock) {
      return { statusCode: 400, message: "Số lượng sản phẩm không đủ !" };
    }
    const filter: FilterQuery<CartDocument> = {
      user: userId,
      "cartItems._id": cartItem._id,
    };
    let update: UpdateQuery<CartDocument>;

    if (quantityUpdate == 0) {
      if (cart.cartItems.length == 1) {
        await deleteCart(cart._id);
        return { statusCode: 200, message: "Đã xóa giỏ hàng thành công !" };
      }
      update = {
        $pull: { cartItems: { _id: cartItem._id } },
      };
    } else {
      update = {
        $set: {
          "cartItems.$.quantity": quantityUpdate,
        },
      };
    }
    return await updateCart(filter, update, { new: true });
  } catch (error) {
    throw error;
  }
}
export async function deleteCart(cartId: string): Promise<void> {
  try {
    await Promise.all([
      UserModel.updateOne({ cart: cartId }, { cart: null }),
      CartModel.findByIdAndDelete(cartId),
    ]);
  } catch (error) {
    throw error;
  }
}
const findCartItemById = (
  cartItems: Array<ICartItem>,
  cartItemId: string
): ICartItem | undefined => {
  return cartItems.find((item) => String(item._id) === cartItemId);
};
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
const handleUpdateCart = async (
  cart: CartDocument,
  userId: string,
  cartItemUpdate: ICartItem
): Promise<CartDocument | { statusCode: number; message: string } | null> => {
  try {
    const item: ICartItem | undefined = cart.cartItems.find(
      (item: ICartItem) =>
        item.product._id == cartItemUpdate.product &&
        item.color == cartItemUpdate.color &&
        item.size == cartItemUpdate.size
    );
    let filter: FilterQuery<CartDocument>, update: UpdateQuery<CartDocument>;

    if (item) {
      const quantityStock = quantityProductStock(item, cartItemUpdate);

      if (
        quantityStock &&
        item.quantity + cartItemUpdate.quantity > quantityStock
      ) {
        return { statusCode: 400, message: "Số lượng sản phẩm không đủ !" };
      }
      filter = {
        user: userId,
        "cartItems._id": item._id,
      };
      update = {
        $set: {
          "cartItems.$.product": item.product,
          "cartItems.$.color": item.color,
          "cartItems.$.size": item.size,
          "cartItems.$.quantity": item.quantity + cartItemUpdate.quantity * 1,
        },
      };
    } else {
      filter = { user: userId };
      update = {
        $push: { cartItems: cartItemUpdate },
      };
    }
    return await updateCart(filter, update, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};
const quantityProductStock = (
  cartItem: ICartItem,
  cartItemUpdate: FilterQuery<ICartItem>
): number | undefined => {
  const color: IColor | undefined = findColorOfProduct(
    cartItem.product.colors,
    cartItemUpdate.color
  );
  const quantityProductStock: number | undefined = color?.sizes.find(
    (size: ISize) => size.size == cartItemUpdate.size
  )?.quantity;
  return quantityProductStock;
};
