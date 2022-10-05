import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { ReviewDocument } from "../models/review.model";
import { createOrder } from "../services/order.service";
import {
  createReview,
  destroyReview,
  forceDestroyReview,
  getAllReview,
  getReview,
  restoreReview,
  updateReview,
} from "../services/review.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function createReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const listReviewInput = req.body.reviews;
    const result = await createReview(listReviewInput, get(req, "user.userId"));
    res.status(result.statusCode).json({ message: result.message });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getAllReviewHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  const reviews = await getAllReview({}, req.query);
  res.json({
    countDocument: reviews.length,
    resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
    data: reviews,
  });
  try {
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getAllReviewByProduct(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const reviews = await getAllReview(
      { product: get(req.params, "productId") },
      req.query
    );
    res.json({
      countDocument: reviews.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: reviews,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const review = await getReview({ _id: req.params.reviewId });
    if (!review)
      return next(new HttpException(404, "Không tìm thấy đánh giá !"));
    res.json(review);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedReview = await updateReview(
      { _id: req.params.reviewId },
      req.body,
      { new: true }
    );
    if (!updatedReview)
      return next(
        new HttpException(400, "Cập nhật đánh giá không thành công !")
      );
    res.json({
      message: "Cập nhật đánh giá thành công !",
      data: updatedReview,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function destroyReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await destroyReview(req.params.reviewId);
  res.json({ message: "Đã xóa mềm đánh giá thành công !" });
  try {
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function forceDestroyReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await forceDestroyReview(req.params.reviewId);
    res.json({ message: "Xóa đánh giá thành công !" });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function restoreReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await restoreReview(req.params.reviewId);
    res.json({ message: "Khôi phục đánh giá thành công !" });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
