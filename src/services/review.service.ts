import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { EOrderStatus, IOrderItem, OrderDocument } from "../models/order.model";
import ProductModel from "../models/product.model";
import ReviewModel, {
  IOrderedProductDetail,
  ReviewDocument,
} from "../models/review.model";
import UserModel from "../models/user.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";
import { getOrder } from "./order.service";
import { getProduct, updateProduct } from "./product.service";
import { updateUser } from "./user.service";

export async function createReview(
  input: Array<DocumentDefinition<ReviewDocument & { orderItemId: string }>>,
  userId: string
) {
  try {
    const order = await getOrder({
      user: userId,
      "orderItems._id": input[0].orderItemId,
      orderStatus: EOrderStatus.Delivered,
    });
    if (!order) {
      return {
        statusCode: 404,
        message:
          "Không tìm thấy đơn hàng của bạn ! Vui lòng kiểm tra trạng thái đơn hàng. ",
      };
    }
    if (order.isEvaluated) {
      return { statusCode: 400, message: "Đơn hàng này đã được đánh giá !" };
    }
    if (input.length !== order.orderItems.length) {
      return {
        statusCode: 400,
        message: "Vui lòng đánh giá đầy đủ số lượng sản phẩm của đơn hàng !",
      };
    }
    const orderedProductDetails: Array<FilterQuery<IOrderedProductDetail>> =
      order.orderItems.map((orderItem: IOrderItem) => {
        return {
          color: orderItem.color,
          quantity: orderItem.quantity,
          size: orderItem.size,
        };
      });
    const inputReviews: FilterQuery<ReviewDocument>[] = input.map(
      (inputItem, index) => {
        return {
          content: inputItem.content,
          star: inputItem.star,
          user: userId,
          orderedProductDetail: orderedProductDetails[index],
          product: order.orderItems[index].product,
        };
      }
    );
    inputReviews.forEach(async (reviewItem: FilterQuery<ReviewDocument>) => {
      const newReview = new ReviewModel(reviewItem);
      const [review, listReviewOfProduct] = await Promise.all([
        newReview.save(),
        getAllReview({ product: reviewItem.product }, {}),
      ]);
      let rate: number = 0;
      if (listReviewOfProduct.length === 0) rate = reviewItem.star;
      else {
        const totalStarReviewProduct: number = listReviewOfProduct.reduce(
          (acc: number, review: ReviewDocument) => acc + review.star,
          0
        );
        rate = totalStarReviewProduct / listReviewOfProduct.length;
      }

      await Promise.all([
        updateProduct(reviewItem.product, {
          $push: { reviews: review._id },
          $set: { rate: rate },
        }),
        updateUser({ _id: userId }, { $push: { reviews: review._id } }),
      ]);
    });
    // order đã đánh giá
    order.isEvaluated = true;
    order.save();
    return { statusCode: 200, message: "Đánh giá sản phẩm thành công !" };
  } catch (error) {
    throw error;
  }
}
export async function getAllReview(
  filter: FilterQuery<ReviewDocument>,
  query: QueryOption
): Promise<Array<ReviewDocument>> {
  try {
    const features = new APIFeatures(ReviewModel.find(filter), query)
      .paginating()
      .sorting()
      .searching()
      .filtering();
    return await features.query;
  } catch (error) {
    throw error;
  }
}
export async function getReview(filter: FilterQuery<ReviewDocument>) {
  try {
    return await ReviewModel.findOne(filter)
      .populate("product")
      .populate("user");
  } catch (error) {
    throw error;
  }
}
export async function updateReview(
  filter: FilterQuery<ReviewDocument>,
  update: UpdateQuery<ReviewDocument>,
  options: QueryOptions
) {
  try {
    return await ReviewModel.findOneAndUpdate(filter, update, options);
  } catch (error) {
    throw error;
  }
}
export async function destroyReview(reviewId: string) {
  try {
    await ReviewModel.delete({ _id: reviewId });
  } catch (error) {
    throw error;
  }
}
export async function restoreReview(reviewId: string): Promise<void> {
  try {
    await ReviewModel.restore({ _id: reviewId });
  } catch (error) {
    throw error;
  }
}
export async function forceDestroyReview(reviewId: string): Promise<void> {
  try {
    await Promise.all([
      UserModel.updateMany(
        { reviews: reviewId },
        { $pull: { reviews: reviewId } }
      ),
      ProductModel.updateMany(
        { reviews: reviewId },
        { $pull: { reviews: reviewId } }
      ),
      ReviewModel.deleteOne({ _id: reviewId }),
    ]);
  } catch (error) {
    throw error;
  }
}
