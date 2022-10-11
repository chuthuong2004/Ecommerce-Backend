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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderHandler = exports.cancelOrderHandler = exports.updateStatusOrderHandler = exports.getOrderHandler = exports.getMyOrderHandler = exports.getAllOrderHandler = exports.createOrderHandler = void 0;
const lodash_1 = require("lodash");
const order_service_1 = require("../services/order.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
function createOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const _a = req.body, { cartItemsId } = _a, orderInput = __rest(_a, ["cartItemsId"]);
            const order = yield (0, order_service_1.createOrder)(orderInput, cartItemsId, (0, lodash_1.get)(req, "user.userId"));
            res.status(201).json(order);
        }
        catch (error) {
            next(new httpException_1.default(404, error.message));
        }
    });
}
exports.createOrderHandler = createOrderHandler;
function getAllOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield (0, order_service_1.getAllOrder)({}, req.query);
            console.log(orders);
            // tổng tiền tất cả đơn hàng
            const totalAmount = orders.reduce((total, order) => total + order.totalPrice, 0);
            res.json({
                countDocument: orders.length,
                totalAmount,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: orders,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllOrderHandler = getAllOrderHandler;
function getMyOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield (0, order_service_1.getAllOrder)({
                user: (0, lodash_1.get)(req, "user.userId"),
            }, req.query);
            console.log(orders);
            if (!orders || orders.length == 0) {
                next(new httpException_1.default(404, "Không tìm thấy đơn đặt hàng !"));
            }
            // tổng tiền tất cả đơn hàng
            const totalAmount = orders.reduce((total, order) => total + order.totalPrice, 0);
            res.json({
                countDocument: orders.length,
                totalAmount,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: orders,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getMyOrderHandler = getMyOrderHandler;
function getOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield (0, order_service_1.getOrder)({ _id: req.params.orderId });
            if (!order) {
                return next(new httpException_1.default(404, "Không tìm thấy đơn hàng !"));
            }
            res.json(order);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getOrderHandler = getOrderHandler;
function updateStatusOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield (0, order_service_1.updateStatusOrder)((0, lodash_1.get)(req.params, "orderId"), (0, lodash_1.get)(req.body, "orderStatus"));
            if (updated.message) {
                return next(new httpException_1.default(updated.statusCode, updated.message));
            }
            res.json(updated);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateStatusOrderHandler = updateStatusOrderHandler;
function cancelOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const canceledReason = req.body.canceledReason;
            const canceledOrder = yield (0, order_service_1.cancelOrder)((0, lodash_1.get)(req.params, "orderId"), (0, lodash_1.get)(req, "user.userId"), canceledReason);
            next(new httpException_1.default(canceledOrder.statusCode, canceledOrder.message));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.cancelOrderHandler = cancelOrderHandler;
function deleteOrderHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleted = yield (0, order_service_1.deleteOrder)((0, lodash_1.get)(req.params, "orderId"), (0, lodash_1.get)(req, "user.userId"));
            next(new httpException_1.default(deleted.statusCode, deleted.message));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteOrderHandler = deleteOrderHandler;
