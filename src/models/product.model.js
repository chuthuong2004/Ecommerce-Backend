"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EGenderType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
var EGenderType;
(function (EGenderType) {
    EGenderType["Woman"] = "women";
    EGenderType["Man"] = "man";
    EGenderType["Kid"] = "kid";
    EGenderType["Unisex"] = "unisex";
})(EGenderType = exports.EGenderType || (exports.EGenderType = {}));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    description: {
        type: String,
        maxlength: 10000,
        required: true,
        trim: true,
    },
    colors: [
        {
            imageMedium: { type: String },
            imageSmall: { type: String },
            images: [{ type: String }],
            sizes: [
                {
                    size: { type: String || Number },
                    quantity: { type: Number },
                },
            ],
            colorName: { type: String, required: true },
        },
    ],
    brand: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Brand" },
    preserveInformation: { type: String },
    deliveryReturnPolicy: { type: String },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    quantitySold: {
        type: Number,
        default: 0,
    },
    keywords: (Array),
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    favorites: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    rate: {
        type: Number,
        default: 0,
    },
    slug: { type: String, slug: "name", unique: true },
    gender: {
        type: String,
        required: true,
        enum: Object.values(EGenderType),
    },
}, { timestamps: true });
ProductSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    overrideMethods: "all",
});
ProductSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const ProductModel = mongoose_1.default.model("Product", ProductSchema);
exports.default = ProductModel;
