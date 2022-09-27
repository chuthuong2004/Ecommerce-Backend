import mongoose from "mongoose";
import slugify from "slugify";
import { ProductDocument } from "./product.model";

export interface BrandDocument extends mongoose.Document {
  name: string;
  logo: string;
  history: string;
  products: Array<ProductDocument["_id"]>;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
const BrandSchema = new mongoose.Schema<BrandDocument>(
  {
    name: { type: String, required: true, unique: true },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    logo: { type: String },
    history: { type: String },
    slug: { type: String, unique: true, slug: "name" },
  },
  { timestamps: true }
);
BrandSchema.pre<BrandDocument>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const BrandModel = mongoose.model<BrandDocument>("Brand", BrandSchema);
export default BrandModel;
