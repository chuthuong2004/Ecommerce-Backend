"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCatalogSchema = exports.getCatalogSchema = exports.updateCatalogSchema = exports.createCatalogSchema = void 0;
const yup_1 = require("yup");
const payload = {
    body: (0, yup_1.object)({
        name: (0, yup_1.string)().required("Vui lòng nhập tên catalog !"),
    }),
};
const params = {
    params: (0, yup_1.object)({
        catalogId: (0, yup_1.string)().required("catalogId is required"),
    }),
};
exports.createCatalogSchema = (0, yup_1.object)(Object.assign({}, payload));
exports.updateCatalogSchema = (0, yup_1.object)(Object.assign(Object.assign({}, params), payload));
exports.getCatalogSchema = (0, yup_1.object)(Object.assign({}, params));
exports.deleteCatalogSchema = (0, yup_1.object)(Object.assign({}, params));
