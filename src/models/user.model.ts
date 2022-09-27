import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { stdSerializers } from "pino";
import { CartDocument } from "./cart.model";
import { OrderDocument } from "./order.model";
import { IColor, ProductDocument } from "./product.model";
import { ReviewDocument } from "./review.model";

export interface Favorite {
  product: ProductDocument["_id"];
  size: string | number;
  color: string;
  colorId: IColor["_id"];
  quantity: number;
}
enum EGender {
  Male = "Nam",
  Female = "Nữ",
  Other = "Other",
}
export interface UserDocument extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: EGender;
  dateOfBirth?: string;
  cart?: CartDocument["_id"];
  orders?: Types.DocumentArray<OrderDocument["_id"]>;
  reviews?: Types.DocumentArray<ReviewDocument["_id"]>;
  favorites?: Types.Array<Favorite>;
  addresses?: Types.Array<AddressDocument>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AddressDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      // required: true,
      minLength: 6,
      maxLength: 25,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    favorites: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        size: { type: String },
        color: { type: String },
        colorId: { type: String },
      },
    ],
    addresses: [
      {
        firstName: { type: String },
        lastName: { type: String },
        phone: { type: String },
        province: { type: String },
        district: { type: String },
        ward: { type: String },
        address: { type: String },
        isDefault: { type: String },
      },
    ],
    gender: { type: String, enum: Object.values(EGender) },
    dateOfBirth: { type: String },
  },
  { timestamps: true }
);

// Used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};
UserSchema.pre("save", async function (next: any) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  // Random additional data
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;
  return next();
});

const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export default UserModel;
