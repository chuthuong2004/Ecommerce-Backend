import mongoose, { Types } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";
import mongooseDelete from "mongoose-delete";
interface OrderedProductDetail {
  size: string;
  color: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ReviewDocument extends mongoose.Document {
  user: UserDocument["_id"];
  product: ProductDocument["_id"];
  orderedProductDetail: OrderedProductDetail;
  content: string;
  star: number;
  enable: boolean;
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
      size: { type: String },
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
    enable: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Add plugin
ReviewSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const ReviewModel = mongoose.model<ReviewDocument>("Review", ReviewSchema);
export default ReviewModel;
