import mongoose, { Types } from "mongoose";
import { AddressDocument, UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";
import { nanoid } from "nanoid";

export interface OrderItemDocument extends mongoose.Document {
  product: ProductDocument["_id"];
  image: string;
  quantity: number;
  size: string;
  color: string;
  discount: number;
  price: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface OrderDocument extends mongoose.Document {
  orderId: string;
  user: UserDocument["_id"];
  orderItems: Types.Array<OrderItemDocument>;
  deliveryInformation: Omit<AddressDocument, "isDefault">;
  taxPrice: number;
  shippingPrice: number;
  orderStatus: EOrderStatus;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: Date;
  shippingAt?: Date;
  deliveryAt?: Date;
  deliveredAt?: Date;
  canceledAt?: Date;
  canceledReason?: string;
  isEvaluated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
enum EOrderStatus {
  Processing = "Processing",
  Shipping = "Shipping",
  Delivery = "Delivery",
  Delivered = "Delivered",
  Canceled = "Canceled",
}
const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `ECO${nanoid(10)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        price: { type: Number, required: true },
        discount: { type: Number },
        quantity: { type: Number, required: true },
        size: { type: Number, required: true },
        color: { type: String, required: true },
        image: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    deliveryInformation: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      address: { type: String, required: true },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      default: EOrderStatus.Processing,
      enum: Object.values(EOrderStatus),
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    shippingAt: { type: Date },
    deliveryAt: { type: Date },
    deliveredAt: { type: Date },
    canceledAt: { type: Date },
    canceledReason: { type: String },
    isEvaluated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
export default OrderModel;
