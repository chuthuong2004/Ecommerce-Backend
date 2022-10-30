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
exports.restoreReviewHandler = exports.forceDestroyReviewHandler = exports.destroyReviewHandler = exports.updateReviewHandler = exports.getReviewHandler = exports.getAllReviewByProduct = exports.getAllReviewHandler = exports.createReviewHandler = void 0;
const lodash_1 = require("lodash");
const review_service_1 = require("../services/review.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
function createReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listReviewInput = req.body.reviews;
            const result = yield (0, review_service_1.createReview)(listReviewInput, (0, lodash_1.get)(req, "user.userId"));
            res.status(result.statusCode).json({ message: result.message });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.createReviewHandler = createReviewHandler;
function getAllReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviews = yield (0, review_service_1.getAllReview)({}, req.query);
        res.json({
            countDocument: reviews.length,
            resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
            data: reviews,
        });
        try {
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllReviewHandler = getAllReviewHandler;
function getAllReviewByProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reviews = yield (0, review_service_1.getAllReview)({ product: (0, lodash_1.get)(req.params, "productId") }, req.query);
            res.json({
                countDocument: reviews.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: reviews,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllReviewByProduct = getAllReviewByProduct;
function getReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const review = yield (0, review_service_1.getReview)({ _id: req.params.reviewId });
            if (!review)
                return next(new httpException_1.default(404, "Không tìm thấy đánh giá !"));
            res.json(review);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getReviewHandler = getReviewHandler;
function updateReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedReview = yield (0, review_service_1.updateReview)({ _id: req.params.reviewId }, req.body, { new: true });
            if (!updatedReview)
                return next(new httpException_1.default(400, "Cập nhật đánh giá không thành công !"));
            res.json({
                message: "Cập nhật đánh giá thành công !",
                data: updatedReview,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateReviewHandler = updateReviewHandler;
function destroyReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, review_service_1.destroyReview)(req.params.reviewId);
        res.json({ message: "Đã xóa mềm đánh giá thành công !" });
        try {
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.destroyReviewHandler = destroyReviewHandler;
function forceDestroyReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, review_service_1.forceDestroyReview)(req.params.reviewId);
            res.json({ message: "Xóa đánh giá thành công !" });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.forceDestroyReviewHandler = forceDestroyReviewHandler;
function restoreReviewHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, review_service_1.restoreReview)(req.params.reviewId);
            res.json({ message: "Khôi phục đánh giá thành công !" });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.restoreReviewHandler = restoreReviewHandler;
