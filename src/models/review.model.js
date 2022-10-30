"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const ReviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
    orderedProductDetail: {
        size: { type: String || Number },
        color: { type: String },
        quantity: { type: Number },
    },
    content: { type: String, trim: true, required: true },
    star: {
        type: Number,
        max: 5,
        min: 1,
        default: 5,
    },
}, { timestamps: true });
// Add plugin
ReviewSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    overrideMethods: "all",
});
const ReviewModel = mongoose_1.default.model("Review", ReviewSchema);
exports.default = ReviewModel;
