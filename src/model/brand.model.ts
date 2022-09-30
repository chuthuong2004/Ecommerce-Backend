import mongoose, { Types } from "mongoose";
import { CategoryDocument } from "./category.model";
// import slug from "mongoose-slug-generator";
export interface BrandDocument extends mongoose.Document {
  categories: Types.DocumentArray<CategoryDocument["_id"]>;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
const CatalogSchema = new mongoose.Schema<BrandDocument>(
  {
    name: { type: String, required: true, unique: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    slug: { type: String, unique: true, slug: "name" },
  },
  { timestamps: true }
);
// mongoose.plugin(slug);
const BrandModel = mongoose.model<BrandDocument>("Brand", CatalogSchema);
export default BrandModel;
