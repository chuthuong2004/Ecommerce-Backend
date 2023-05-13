import mongoose, { Types } from "mongoose";
import { UserDocument } from "./user.model";
// import slug from "mongoose-slug-generator";
export interface CouponDocument extends mongoose.Document {
  name: string;
  code: string;
  expire: Date;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
  // lần đầu mua
}
const CouponSchema = new mongoose.Schema<CouponDocument>(
  {
    
  },
  { timestamps: true }
);
const CouponModel = mongoose.model<CouponDocument>(
  "Coupon",
  CouponSchema
);
export default CouponModel;
