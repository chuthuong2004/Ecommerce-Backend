"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderSchema = exports.getOrderSchema = exports.cancelOrderSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        deliveryInformation: (0, yup_1.object)({
            address: (0, yup_1.string)().trim().required("address is required"),
            ward: (0, yup_1.string)().trim().required("ward is required"),
            district: (0, yup_1.string)().trim().required("district is required"),
            province: (0, yup_1.string)().trim().required("province is required"),
            phone: (0, yup_1.string)()
                .required("phone is required !")
                .matches(/^(03|09|08|07)[0-9]{8}$/, "Vui lòng nhập số điện thoại hợp lệ !"),
            lastName: (0, yup_1.string)().trim().required("lastName is required"),
            firstName: (0, yup_1.string)().trim().required("firstName is required"),
        }).required("deliveryInformation is required"),
        cartItemsId: (0, yup_1.array)()
            .required("cartItemsId is required")
            .min(1, "Vui lòng nhập cartItem id "),
    }),
};
const params = {
    params: (0, yup_1.object)({
        orderId: (0, yup_1.string)().required("orderId is required"),
    }),
};
exports.createOrderSchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateOrderSchema = (0, yup_1.object)(Object.assign({ body: (0, yup_1.object)({
        orderStatus: (0, yup_1.string)().required("orderStatus is required"),
    }) }, params));
exports.cancelOrderSchema = (0, yup_1.object)(Object.assign({ body: (0, yup_1.object)({
        canceledReason: (0, yup_1.string)().required("canceledReason is required"),
    }) }, params));
exports.getOrderSchema = (0, yup_1.object)(Object.assign({}, params));
exports.deleteOrderSchema = (0, yup_1.object)(Object.assign({}, params));
