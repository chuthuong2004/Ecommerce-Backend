"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartSchema = exports.removeItemFromCartSchema = exports.getCartSchema = exports.updateCartSchema = exports.addItemToCartSchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        size: (0, yup_1.string)().required("size is required"),
        color: (0, yup_1.string)().required("color is required"),
        product: (0, yup_1.string)().required("product is required !"),
    }),
};
const params = {
    params: (0, yup_1.object)({
        cartId: (0, yup_1.string)().required("cartId is required"),
    }),
};
exports.addItemToCartSchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateCartSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        quantity: (0, yup_1.number)()
            .required("quantity is required")
            .min(0, "Số lượng phải lớn hơn 0"),
    }),
    params: (0, yup_1.object)({
        cartItemId: (0, yup_1.string)().required("cartItemId is required"),
    }),
});
exports.getCartSchema = (0, yup_1.object)(Object.assign({}, params));
exports.removeItemFromCartSchema = (0, yup_1.object)({
    params: (0, yup_1.object)({
        cartItemId: (0, yup_1.string)().required("cartItemId is required"),
    }),
});
exports.deleteCartSchema = (0, yup_1.object)(Object.assign({}, params));
