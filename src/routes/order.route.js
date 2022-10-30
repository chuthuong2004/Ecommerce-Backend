"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const middlewares_1 = require("../middlewares");
const order_schema_1 = require("../schemas/order.schema");
const router = express_1.default.Router();
//  CREATE NEW ORDER
router.post("/order/new", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(order_schema_1.createOrderSchema)], order_controller_1.createOrderHandler);
// GET MY ORDER
router.get("/order/me", middlewares_1.requiresUser, order_controller_1.getMyOrderHandler);
// GET ORDER
router.get("/order/:orderId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(order_schema_1.getOrderSchema)], order_controller_1.getOrderHandler);
// GET ALL ORDER
router.get("/admin/orders", middlewares_1.requiresAdmin, order_controller_1.getAllOrderHandler);
// UPDATE ORDER --- design send mail
router.put("/admin/order/:orderId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(order_schema_1.updateOrderSchema)], order_controller_1.updateStatusOrderHandler);
router.put("/order/cancel/:orderId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(order_schema_1.cancelOrderSchema)], order_controller_1.cancelOrderHandler);
// DELETE ORDER
router.delete("/admin/order/:orderId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(order_schema_1.deleteOrderSchema)], order_controller_1.deleteOrderHandler);
exports.default = router;
