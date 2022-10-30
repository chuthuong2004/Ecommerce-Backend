"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrandSchema = exports.getBrandSchema = exports.updateBrandSchema = exports.createBrandSchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        name: (0, yup_1.string)().required("Vui lòng nhập tên brand !"),
    }),
};
const params = {
    params: (0, yup_1.object)({
        brandId: (0, yup_1.string)().required("brandId is required"),
    }),
};
exports.createBrandSchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateBrandSchema = (0, yup_1.object)(Object.assign(Object.assign({}, params), payload));
exports.getBrandSchema = (0, yup_1.object)(Object.assign({}, params));
exports.deleteBrandSchema = (0, yup_1.object)(Object.assign({}, params));
