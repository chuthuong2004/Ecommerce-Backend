import mongoose, { Types } from "mongoose";
import slugify from "slugify";
import { CatalogDocument } from "./catalog.model";
import { ProductDocument } from "./product.model";
// import slug from "mongoose-slug-generator";
export interface CategoryDocument extends mongoose.Document {
  products: Types.DocumentArray<ProductDocument["_id"]>;
  catalog: CatalogDocument["_id"];
  name: string;
  gender: Array<string>;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
const CategorySchema = new mongoose.Schema<CategoryDocument>(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog" },
    gender: [{ type: String }],
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, slug: "name" },
  },
  { timestamps: true }
);
CategorySchema.pre<CategoryDocument>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const CategoryModel = mongoose.model<CategoryDocument>(
  "Category",
  CategorySchema
);
export default CategoryModel;
