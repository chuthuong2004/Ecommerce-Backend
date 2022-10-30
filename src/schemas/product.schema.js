"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreProductSchema = exports.deleteProductSchema = exports.getProductSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        gender: (0, yup_1.string)().required("gender is required"),
        category: (0, yup_1.string)().required("category is required"),
        brand: (0, yup_1.string)().required("brand is required"),
        description: (0, yup_1.string)().required("description is required"),
        colors: (0, yup_1.array)().min(1).required("array colors is required"),
        // .of(
        // object({
        // star: number()
        // .required("star is required")
        // .min(1, "Giá trị nhỏ nhất của star là 1")
        // .max(5, "Giá trị lớn nhất của star là 5"),
        // content: string().required("content is required"),
        // orderItemId: string().required("orderItemId is required"),
        // }).required()
        price: (0, yup_1.number)().required("price is required !"),
        name: (0, yup_1.string)().required("name is required !"),
    }),
};
const params = {
    params: (0, yup_1.object)({
        productId: (0, yup_1.string)().required("productId is required"),
    }),
};
exports.createProductSchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateProductSchema = (0, yup_1.object)(Object.assign({ body: (0, yup_1.object)({
    // name: string().required("Vui lòng nhập tên danh mục !"),
    }) }, params));
exports.getProductSchema = (0, yup_1.object)(Object.assign({}, params));
exports.deleteProductSchema = (0, yup_1.object)(Object.assign({}, params));
exports.restoreProductSchema = (0, yup_1.object)(Object.assign({}, params));
