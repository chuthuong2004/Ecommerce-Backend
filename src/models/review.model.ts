import mongoose, { Types } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
export interface IOrderedProductDetail {
  size: string | number;
  color: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ReviewDocument extends SoftDeleteDocument {
  user: UserDocument["_id"];
  product: ProductDocument["_id"];
  orderedProductDetail: IOrderedProductDetail;
  content: string;
  star: number;
  createdAt: Date;
  updatedAt: Date;
}
const ReviewSchema = new mongoose.Schema<ReviewDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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
  },
  { timestamps: true }
);
// Add plugin
ReviewSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const ReviewModel = mongoose.model<
  ReviewDocument,
  SoftDeleteModel<ReviewDocument>
>("Review", ReviewSchema);
export default ReviewModel;
