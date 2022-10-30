"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const CategorySchema = new mongoose_1.default.Schema({
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    catalog: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Catalog" },
    gender: [{ type: String }],
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, slug: "name" },
}, { timestamps: true });
CategorySchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const CategoryModel = mongoose_1.default.model("Category", CategorySchema);
exports.default = CategoryModel;
