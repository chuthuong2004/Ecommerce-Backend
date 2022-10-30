"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategorySchema = exports.getCategorySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        name: (0, yup_1.string)().required("Vui lòng nhập tên danh mục !"),
        catalog: (0, yup_1.string)().required("catalog is required"),
    }),
};
const params = {
    params: (0, yup_1.object)({
        categoryId: (0, yup_1.string)().required("categoryId is required"),
    }),
};
exports.createCategorySchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateCategorySchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        name: (0, yup_1.string)().required("Vui lòng nhập tên danh mục !"),
    }),
});
exports.getCategorySchema = (0, yup_1.object)(Object.assign({}, params));
exports.deleteCategorySchema = (0, yup_1.object)(Object.assign({}, params));
