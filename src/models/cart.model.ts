import mongoose, { Types } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

export interface ICartItem {
  product: ProductDocument["_id"];
  quantity: number;
  size: string;
  color: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}
export interface CartDocument extends mongoose.Document {
  user: UserDocument["_id"];
  cartItems: Types.Array<ICartItem>;
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
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model<CartDocument>("Cart", CartSchema);
export default CartModel;
