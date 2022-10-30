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
exports.restoreProductHandler = exports.forceDestroyProductHandler = exports.deleteProductHandler = exports.removeFavoriteHandler = exports.addFavoriteHandler = exports.ActionFavorite = exports.updateProductHandler = exports.getProductBySlugHandler = exports.getProductHandler = exports.getAllProductHandler = exports.createProductHandler = void 0;
const product_service_1 = require("../services/product.service");
const lodash_1 = require("lodash");
const httpException_1 = __importDefault(require("../utils/httpException"));
// * CREATE PRODUCT --- DONE
function createProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield (0, product_service_1.createProduct)(req.body);
            if (!product) {
                return next(new httpException_1.default(400, "Thêm sản phẩm không thành công !"));
            }
            return res.json(product);
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    });
}
exports.createProductHandler = createProductHandler;
// * GET ALL PRODUCT --- DONE
function getAllProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield (0, product_service_1.getAllProduct)(req.query);
            res.json({
                countDocument: products.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: products,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllProductHandler = getAllProductHandler;
// * GET PRODUCT --- DONE
function getProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield (0, product_service_1.getProduct)({ _id: (0, lodash_1.get)(req.params, "productId") });
            if (!product) {
                return next(new httpException_1.default(400, "Không tìm thấy product !"));
            }
            res.json(product);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getProductHandler = getProductHandler;
function getProductBySlugHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield (0, product_service_1.getProduct)({ slug: (0, lodash_1.get)(req.params, "slug") });
            if (!product) {
                return next(new httpException_1.default(400, "Không tìm thấy product !"));
            }
            res.json(product);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getProductBySlugHandler = getProductBySlugHandler;
// * UPDATE PRODUCT --- DONE
function updateProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let product = yield (0, product_service_1.updateProduct)((0, lodash_1.get)(req.params, "productId"), req.body);
            if (!product) {
                return next(new httpException_1.default(400, "Không nhật product không thành công !"));
            }
            res.json({
                message: "Cập nhật product thành công !",
                data: product,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateProductHandler = updateProductHandler;
var ActionFavorite;
(function (ActionFavorite) {
    ActionFavorite["ADD"] = "add";
    ActionFavorite["REMOVE"] = "remove";
})(ActionFavorite = exports.ActionFavorite || (exports.ActionFavorite = {}));
function addFavoriteHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield (0, product_service_1.handleFavorite)((0, lodash_1.get)(req.params, "productId"), (0, lodash_1.get)(req, "user.userId"), ActionFavorite.ADD);
            if (!product)
                return next(new httpException_1.default(404, "Không tìm thấy product !"));
            res.json({
                message: "Đã thêm sản phẩm vào danh sách yêu thích !",
                data: product,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.addFavoriteHandler = addFavoriteHandler;
function removeFavoriteHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield (0, product_service_1.handleFavorite)((0, lodash_1.get)(req.params, "productId"), (0, lodash_1.get)(req, "user.userId"), ActionFavorite.REMOVE);
            if (!product)
                return next(new httpException_1.default(404, "Không tìm thấy product !"));
            res.json({
                message: "Đã xóa sản phẩm khỏi danh sách yêu thích !",
                data: product,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.removeFavoriteHandler = removeFavoriteHandler;
function deleteProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleted = yield (0, product_service_1.deleteProduct)(req.params.productId);
            if (!deleted)
                return next(new httpException_1.default(404, "Không tìm thấy product để xử lý xóa mềm !"));
            res.json({
                message: "Xóa mềm thành công !",
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteProductHandler = deleteProductHandler;
function forceDestroyProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const destroyProduct = yield (0, product_service_1.forceDestroyProduct)((0, lodash_1.get)(req.params, "productId"));
            if (!destroyProduct)
                return next(new httpException_1.default(404, "Không tìm thấy product để xử lý xóa hẳn !"));
            res.json({
                message: "Đã xóa sản phẩm thành công !",
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.forceDestroyProductHandler = forceDestroyProductHandler;
function restoreProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const restored = yield (0, product_service_1.restoreProduct)(req.params.productId);
            if (!restored)
                return next(new httpException_1.default(404, "Không tìm thấy product để khôi phục !"));
            res.json({
                message: "Khôi phục sản phẩm thành công !",
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.restoreProductHandler = restoreProductHandler;
