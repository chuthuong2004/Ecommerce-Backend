"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    cartItems: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, default: 1 },
            size: { type: String },
            color: { type: String },
            image: { type: String },
        },
    ],
}, { timestamps: true });
const CartModel = mongoose_1.default.model("Cart", CartSchema);
exports.default = CartModel;
