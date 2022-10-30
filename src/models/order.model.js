"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOrderStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
var EOrderStatus;
(function (EOrderStatus) {
    EOrderStatus["Processing"] = "Processing";
    EOrderStatus["Shipping"] = "Shipping";
    EOrderStatus["Delivery"] = "Delivery";
    EOrderStatus["Delivered"] = "Delivered";
    EOrderStatus["Canceled"] = "Canceled";
})(EOrderStatus = exports.EOrderStatus || (exports.EOrderStatus = {}));
const OrderSchema = new mongoose_1.default.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => {
            const uuid = (0, uuid_1.v4)().toUpperCase();
            return `ECO${uuid.split("-")[0]}${uuid.split("-")[1]}`;
        },
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: { type: Number, required: true },
            discount: { type: Number },
            quantity: { type: Number, required: true },
            size: { type: String || Number, required: true },
            color: { type: String, required: true },
            image: { type: String, required: true },
            brandName: { type: String, required: true },
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    deliveryInformation: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        address: { type: String, required: true },
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: { type: Number, required: true, default: 0 },
    provisionalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
        type: String,
        default: EOrderStatus.Processing,
        enum: Object.values(EOrderStatus),
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    shippingAt: { type: Date },
    deliveryAt: { type: Date },
    deliveredAt: { type: Date },
    canceledAt: { type: Date },
    canceledReason: { type: String },
    isEvaluated: { type: Boolean, default: false },
}, { timestamps: true });
const OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
