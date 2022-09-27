import mongoose, { Types } from "mongoose";
import { CategoryDocument } from "./category.model";
// import slug from "mongoose-slug-generator";
import slugify from "slugify";
import { EGenderType } from "./product.model";
export interface CatalogDocument extends mongoose.Document {
  categories: Types.DocumentArray<CategoryDocument["_id"]>;
  name: string;
  type: Array<CategoryGenderType>;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}
interface CategoryGenderType {
  productType: EGenderType;
  image: string;
  description: string;
  slug: string;
}
const CatalogSchema = new mongoose.Schema<CatalogDocument>(
  {
    name: { type: String, required: true, unique: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    type: [
      {
        productType: {
          type: String,
          required: true,
          enum: Object.values(EGenderType),
        },
        image: { type: String },
        description: { type: String },
        slug: { type: String, slug: "productType" },
      },
    ],
    slug: { type: String, unique: true, slug: "name" },
  },
  { timestamps: true }
);
CatalogSchema.pre<CatalogDocument>("save", function (next) {
  const newType: Array<CategoryGenderType> = this.type.map(
    (type: CategoryGenderType) => {
      return {
        ...type,
        slug: slugify(this.name + " " + type.productType, { lower: true }),
      };
    }
  );
  this.type = newType;
  this.slug = slugify(this.name, { lower: true });
  next();
});
const CatalogModel = mongoose.model<CatalogDocument>("Catalog", CatalogSchema);
export default CatalogModel;
