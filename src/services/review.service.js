"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceDestroyReview = exports.restoreReview = exports.destroyReview = exports.updateReview = exports.getReview = exports.getAllReview = exports.createReview = void 0;
const order_model_1 = require("../models/order.model");
const product_model_1 = __importDefault(require("../models/product.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
const order_service_1 = require("./order.service");
const product_service_1 = require("./product.service");
const user_service_1 = require("./user.service");
function createReview(input, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield (0, order_service_1.getOrder)({
                user: userId,
                "orderItems._id": input[0].orderItemId,
                orderStatus: order_model_1.EOrderStatus.Delivered,
            });
            if (!order) {
                return {
                    statusCode: 404,
                    message: "Không tìm thấy đơn hàng của bạn ! Vui lòng kiểm tra trạng thái đơn hàng. ",
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
            const orderedProductDetails = order.orderItems.map((orderItem) => {
                return {
                    color: orderItem.color,
                    quantity: orderItem.quantity,
                    size: orderItem.size,
                };
            });
            const inputReviews = input.map((inputItem, index) => {
                return {
                    content: inputItem.content,
                    star: inputItem.star,
                    user: userId,
                    orderedProductDetail: orderedProductDetails[index],
                    product: order.orderItems[index].product,
                };
            });
            inputReviews.forEach((reviewItem) => __awaiter(this, void 0, void 0, function* () {
                const newReview = new review_model_1.default(reviewItem);
                const [review, listReviewOfProduct] = yield Promise.all([
                    newReview.save(),
                    getAllReview({ product: reviewItem.product }, {}),
                ]);
                let rate = 0;
                if (listReviewOfProduct.length === 0)
                    rate = reviewItem.star;
                else {
                    const totalStarReviewProduct = listReviewOfProduct.reduce((acc, review) => acc + review.star, 0);
                    rate = totalStarReviewProduct / listReviewOfProduct.length;
                }
                yield Promise.all([
                    (0, product_service_1.updateProduct)(reviewItem.product, {
                        $push: { reviews: review._id },
                        $set: { rate: rate },
                    }),
                    (0, user_service_1.updateUser)({ _id: userId }, { $push: { reviews: review._id } }),
                ]);
            }));
            // order đã đánh giá
            order.isEvaluated = true;
            order.save();
            return { statusCode: 200, message: "Đánh giá sản phẩm thành công !" };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createReview = createReview;
function getAllReview(filter, query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(review_model_1.default.find(filter), query)
                .paginating()
                .sorting()
                .searching()
                .filtering();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getAllReview = getAllReview;
function getReview(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield review_model_1.default.findOne(filter)
                .populate("product")
                .populate("user");
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getReview = getReview;
function updateReview(filter, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield review_model_1.default.findOneAndUpdate(filter, update, options);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateReview = updateReview;
function destroyReview(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield review_model_1.default.delete({ _id: reviewId });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.destroyReview = destroyReview;
function restoreReview(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield review_model_1.default.restore({ _id: reviewId });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.restoreReview = restoreReview;
function forceDestroyReview(reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all([
                user_model_1.default.updateMany({ reviews: reviewId }, { $pull: { reviews: reviewId } }),
                product_model_1.default.updateMany({ reviews: reviewId }, { $pull: { reviews: reviewId } }),
                review_model_1.default.deleteOne({ _id: reviewId }),
            ]);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.forceDestroyReview = forceDestroyReview;
