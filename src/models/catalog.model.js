"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import slug from "mongoose-slug-generator";
const slugify_1 = __importDefault(require("slugify"));
const product_model_1 = require("./product.model");
const CatalogSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    categories: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Category",
        },
    ],
    type: [
        {
            productType: {
                type: String,
                required: true,
                enum: Object.values(product_model_1.EGenderType),
            },
            image: { type: String },
            description: { type: String },
            slug: { type: String, slug: "productType" },
        },
    ],
    slug: { type: String, unique: true, slug: "name" },
}, { timestamps: true });
CatalogSchema.pre("save", function (next) {
    const newType = this.type.map((type) => {
        return Object.assign(Object.assign({}, type), { slug: (0, slugify_1.default)(this.name + " " + type.productType, { lower: true }) });
    });
    this.type = newType;
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const CatalogModel = mongoose_1.default.model("Catalog", CatalogSchema);
exports.default = CatalogModel;
