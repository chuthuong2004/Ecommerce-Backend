"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCatalogHandler = exports.uploadProductHandler = exports.uploadSingleHandler = void 0;
const httpException_1 = __importDefault(require("../utils/httpException"));
function uploadSingleHandler(req, res, next) {
    try {
        return res.json({
            message: "Đã upload hình ảnh thành công",
            file: req.file,
            files: req.files,
        });
    }
    catch (error) {
        next(new httpException_1.default(500, error.message));
    }
}
exports.uploadSingleHandler = uploadSingleHandler;
function uploadProductHandler(req, res, next) {
    try {
        return res.json({
            message: "Đã upload nhiều hình ảnh thành công !",
            files: req.files,
        });
    }
    catch (error) {
        next(new httpException_1.default(500, error.message));
    }
}
exports.uploadProductHandler = uploadProductHandler;
function uploadCatalogHandler(req, res, next) {
    try {
        if (req.files && req.files.length > 0)
            return res.json({
                message: "Đã upload nhiều hình ảnh thành công !",
                data: req.files,
            });
        next(new httpException_1.default(400, "Upload hình ảnh thất bại !"));
    }
    catch (error) {
        next(new httpException_1.default(500, error.message));
    }
}
exports.uploadCatalogHandler = uploadCatalogHandler;
