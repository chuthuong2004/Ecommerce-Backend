"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const BrandSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    logo: { type: String },
    history: { type: String },
    slug: { type: String, unique: true, slug: "name" },
}, { timestamps: true });
BrandSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const BrandModel = mongoose_1.default.model("Brand", BrandSchema);
exports.default = BrandModel;
