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
exports.deleteCartHandler = exports.updateCartHandler = exports.removeItemFromCartHandler = exports.addItemToCartHandler = exports.getMyCartHandler = exports.getCartHandler = exports.getAllCartHandler = void 0;
const lodash_1 = require("lodash");
const cart_service_1 = require("../services/cart.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
function getAllCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const carts = yield (0, cart_service_1.getAllCart)(req.query);
            res.json({
                countDocument: carts.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: carts,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllCartHandler = getAllCartHandler;
function getCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cart = yield (0, cart_service_1.getCart)({
                _id: (0, lodash_1.get)(req.params, "cartId"),
            });
            if (!cart)
                return next(new httpException_1.default(404, "Không tìm thấy giỏ hàng !"));
            res.json(cart);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getCartHandler = getCartHandler;
function getMyCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cart = yield (0, cart_service_1.getCart)({
                user: (0, lodash_1.get)(req, "user.userId"),
            });
            if (!cart)
                return next(new httpException_1.default(404, "Không tìm thấy giỏ hàng !"));
            res.json(cart);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getMyCartHandler = getMyCartHandler;
function addItemToCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cartItem = Object.assign(Object.assign({}, req.body), { quantity: req.body.quantity && req.body.quantity > 0 ? req.body.quantity : 1 });
            const cart = yield (0, cart_service_1.addItemToCart)(cartItem, (0, lodash_1.get)(req, "user.userId"));
            if (!cart)
                return next(new httpException_1.default(400, "Thêm giỏ hàng không thành công !"));
            if (cart === null || cart === void 0 ? void 0 : cart.message)
                return next(new httpException_1.default(cart.statusCode, cart.message));
            res.json({ message: "Thêm vào giỏ hàng thành công !", data: cart });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.addItemToCartHandler = addItemToCartHandler;
function removeItemFromCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cart = yield (0, cart_service_1.removeItemFromCart)((0, lodash_1.get)(req, "user.userId"), (0, lodash_1.get)(req.params, "cartItemId"));
            if (!cart)
                return next(new httpException_1.default(400, "Xóa cart item không thành công !"));
            if (cart.message)
                return next(new httpException_1.default(cart.statusCode, cart.message));
            res.json(cart);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.removeItemFromCartHandler = removeItemFromCartHandler;
function updateCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cart = yield (0, cart_service_1.updateQuantityCart)((0, lodash_1.get)(req, "user.userId"), (0, lodash_1.get)(req.body, "quantity"), (0, lodash_1.get)(req.params, "cartItemId"));
            if (!cart)
                return next(new httpException_1.default(400, "Lỗi update cart !"));
            if (cart.message)
                return next(new httpException_1.default(cart.statusCode, cart.message));
            res.json(cart);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateCartHandler = updateCartHandler;
function deleteCartHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, cart_service_1.deleteCart)((0, lodash_1.get)(req.params, "cartId"));
            res.json({ message: "Xóa giỏ hàng thành công !" });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteCartHandler = deleteCartHandler;
