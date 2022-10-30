"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewSchema = exports.getAllReviewByProductSchema = exports.getReviewSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        reviews: (0, yup_1.array)()
            .min(1)
            .required("array reviews is required")
            .of((0, yup_1.object)({
            star: (0, yup_1.number)()
                .required("star is required")
                .min(1, "Giá trị nhỏ nhất của star là 1")
                .max(5, "Giá trị lớn nhất của star là 5"),
            content: (0, yup_1.string)().required("content is required"),
            orderItemId: (0, yup_1.string)().required("orderItemId is required"),
        }).required()),
    }),
};
const params = {
    params: (0, yup_1.object)({
        reviewId: (0, yup_1.string)().required("reviewId is required"),
    }),
};
exports.createReviewSchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateReviewSchema = (0, yup_1.object)(Object.assign({}, params));
exports.getReviewSchema = (0, yup_1.object)(Object.assign({}, params));
exports.getAllReviewByProductSchema = (0, yup_1.object)({
    params: (0, yup_1.object)({
        productId: (0, yup_1.string)().required("productId is required"),
    }),
});
exports.deleteReviewSchema = (0, yup_1.object)(Object.assign({}, params));
