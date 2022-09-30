import mongoose, { Types } from "mongoose";
import { BrandDocument } from "./brand.model";
import { CategoryDocument } from "./category.model";
import { ReviewDocument } from "./review.model";
// import slug from "mongoose-slug-generator";
import mongooseDelete from "mongoose-delete";
import { UserDocument } from "./user.model";
import slugify from "slugify";

interface ISize {
  size: string | number;
  quantity: number;
}
export interface IColor {
  images: Array<string>;
  imageSmall: string;
  imageMedium: string;
  colorName: string;
  sizes: Array<ISize>;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}
export enum EGenderType {
  Woman = "woman",
  Man = "man",
  Kid = "kid",
  Unisex = "unisex",
}
export interface ProductDocument extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  discount: number;
  category: CategoryDocument["_id"];
  likeCount: number;
  quantitySold: number;
  favorites: Types.Array<UserDocument["_id"]>;
  rate?: number;
  keywords?: Array<string>;
  reviews?: Types.Array<ReviewDocument["_id"]>;
  colors: Types.Array<IColor>;
  brand: BrandDocument["_id"];
  gender: EGenderType;
  preserveInformation?: string;
  deliveryReturnPolicy?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
const ProductSchema = new mongoose.Schema<ProductDocument>(
  {
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
            quantity: { type: String },
          },
        ],
        colorName: { type: String, required: true },
      },
    ],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    preserveInformation: { type: String },
    deliveryReturnPolicy: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
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
    keywords: Array<String>,
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);
ProductSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
ProductSchema.pre<ProductDocument>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const ProductModel = mongoose.model<ProductDocument>("Product", ProductSchema);
export default ProductModel;
