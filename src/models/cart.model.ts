import mongoose, { Types } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

export interface CartItemDocument extends mongoose.Document {
  product: ProductDocument["_id"];
  quantity: number;
  size: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CartDocument extends mongoose.Document {
  user: UserDocument["_id"];
  cartItems: Types.Array<CartItemDocument>;
  createdAt: Date;
  updatedAt: Date;
}
const CartSchema = new mongoose.Schema<CartDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        size: { type: String },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model<CartDocument>("Cart", CartSchema);
export default CartModel;
