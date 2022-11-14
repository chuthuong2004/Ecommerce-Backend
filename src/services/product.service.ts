import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import { ActionFavorite } from "../controllers/product.controller";
import log from "../logger";
import BrandModel from "../models/brand.model";
import CartModel from "../models/cart.model";
import { CatalogDocument } from "../models/catalog.model";
import CategoryModel from "../models/category.model";
import ProductModel, { ProductDocument } from "../models/product.model";
import ReviewModel from "../models/review.model";
import UserModel, { IFavorite } from "../models/user.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";

export async function createProduct(
  input: DocumentDefinition<ProductDocument>
) {
  try {
    const product = new ProductModel(input);
    await product.save();
    await CategoryModel.updateOne(
      {
        _id: input.category,
      },
      {
        $push: { products: product._id },
      }
    );
    await BrandModel.updateOne(
      {
        _id: input.brand,
      },
      {
        $push: { products: product._id },
      }
    );
    return product;
  } catch (error) {
    throw error;
  }
}
export async function getAllProduct(
  query: QueryOption
): Promise<Array<CatalogDocument>> {
  try {
    const features = new APIFeatures(
      ProductModel.find()
        .populate({ path: "brand", select: "-products" })
        .populate("category"),
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
export async function getProduct(filter: FilterQuery<ProductDocument>) {
  try {
    // console.log(filter);

    const product = await ProductModel.findOne(filter)
      .populate("brand")
      .populate("category");
    return product;
  } catch (error) {
    throw error;
  }
}

// * update product --- DONE
export async function updateProduct(
  productId: string,
  update: UpdateQuery<ProductDocument>
): Promise<ProductDocument | null> {
  try {
    // kiểm tra nếu update có ID brand thì xóa product khỏi brand cũ và add product vào brand mới
    const product = await ProductModel.findById(productId);
    if (update.brand) {
      // xử lý cập nhật lại brand
      const newBrand = await BrandModel.findById(update.brand);
      // nếu brand mới này mà chưa có product thì update lại brand
      if (!newBrand?.products.includes(productId)) {
        // Thêm product vào brand mới
        await BrandModel.updateOne(
          {
            _id: update.brand,
          },
          {
            $push: { products: productId },
          }
        );
        // xóa product khỏi brand cũ
        await BrandModel.updateOne(
          {
            _id: product?.brand,
          },
          { $pull: { products: productId } }
        );
      }
    }
    if (update.category) {
      // xử lý cập nhật lại category
      const newCategory = await CategoryModel.findById(update.category);
      // nếu category mới này mà chưa có product thì update lại category
      if (!newCategory?.products.includes(productId)) {
        // Thêm product vào category mới
        await CategoryModel.updateOne(
          {
            _id: update.category,
          },
          {
            $push: { products: productId },
          }
        );
        // xóa product khỏi brand cũ
        await CategoryModel.updateOne(
          {
            _id: product?.category,
          },
          { $pull: { products: productId } }
        );
      }
    }
    return await ProductModel.findByIdAndUpdate(productId, update, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}

// * xử lý yêu thích sản phẩm --- DONE
export async function handleFavorite(
  productId: string,
  userId: string,
  actionFavorite: string
): Promise<ProductDocument | null> {
  try {
    let updateProduct =
      actionFavorite === ActionFavorite.ADD
        ? { $addToSet: { favorites: userId } }
        : { $pull: { favorites: userId } };
    const [product, user] = await Promise.all([
      ProductModel.findByIdAndUpdate(
        productId,
        updateProduct, // nếu product chưa có userId này thì add vào,
        { new: true }
      ),
      UserModel.findById(userId),
    ]);
    if (!product) return null;
    product.likeCount = product.favorites.length; // gán lại lượt thích bằng độ dài của mảng favorites

    let updateUser;
    if (actionFavorite === ActionFavorite.ADD) {
      // nếu không truyền vào favorite thì sẽ lấy favorite phần tử thứ 0 của product
      const favorite: IFavorite = {
        product: product._id,
        color: product.colors[0].colorName,
        colorId: product.colors[0]?._id,
        size: product.colors[0].sizes[0].size,
        quantity: 1,
      };
      updateUser = { $push: { favorites: favorite } };
    } else if (actionFavorite === ActionFavorite.REMOVE) {
      // tìm xem product này đã có trong favorite nào của user không nếu có trả về 1 Favorite còn không trả về undefined
      const favoriteForUser = user?.favorites?.find(
        (favorite: IFavorite) => favorite.product == productId
      );
      updateUser = { $pull: { favorites: favoriteForUser } };
    }
    // nếu không có favorite thì mới thêm vào user
    await UserModel.findByIdAndUpdate(userId, updateUser, { new: true });
    return await product.save();
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const deleteProduct = await ProductModel.delete({ _id: productId });
    // console.log(deleteProduct);
    return deleteProduct;
  } catch (error) {
    throw error;
  }
}
export async function restoreProduct(productId: string) {
  try {
    const restoreProduct = await ProductModel.restore({ _id: productId });
    // console.log(restoreProduct);
    return restoreProduct;
  } catch (error) {
    throw error;
  }
}
export async function forceDestroyProduct(productId: string) {
  try {
    // muốn xóa 1 sản phẩm khỏi db thì phải xóa tất cả dữ liệu liên quan đến nó
    const [carts] = await Promise.all([
      CartModel.find({
        "cartItems.$.product": productId,
      }),
      CategoryModel.updateMany(
        {
          products: productId,
        },
        {
          $pull: { products: productId },
        }
      ),
      ReviewModel.findOneAndDelete({ product: productId }),
    ]);
    // * DELETE ITEM FROM CART SUCCESSFULLY
    if (carts) {
      carts.forEach(async (cart) => {
        if (cart.cartItems.length == 1) {
          // nếu cart này chỉ có 1 item là sản phẩm cần xóa thì tiến hành xóa luôn cart này và update lại user
          await Promise.all([
            UserModel.updateOne({ cart: cart._id }, { cart: null }),
            CartModel.findByIdAndDelete(cart._id),
          ]);
          // await UserModel.updateOne({ cart: cart._id }, { cart: null });
          // await CartModel.findByIdAndDelete(cart._id);
        } else {
          // nếu cart này mà có nhiều hơn 1 item thì xóa product khỏi các cart này ra
          await CartModel.updateMany(
            { "cartItems.$.product": productId },
            { $pull: { cartItems: { product: productId } } }
          );
        }
      });
    }

    return await ProductModel.deleteOne({
      _id: productId,
    });
  } catch (error) {
    throw error;
  }
}
