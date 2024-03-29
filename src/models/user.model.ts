import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import { stdSerializers } from "pino";
import { CartDocument } from "./cart.model";
import { OrderDocument } from "./order.model";
import { IColor, ProductDocument } from "./product.model";
import { ReviewDocument } from "./review.model";
import config from "./../config/default";

export interface IFavorite {
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
  favorites?: Types.Array<IFavorite>;
  addresses?: Types.Array<IAddress>;
  loggedOut: boolean;
  loggedOutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAddressResponse {
  firstName: string;
  lastName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  _id?: string;
}
export interface IAddressUserResponse extends IAddressResponse {
  isDefault: boolean;
}
export interface IFavoriteResponse {
  product: ProductDocument;
  size: string | number;
  color: string;
  colorId: IColor["_id"];
  quantity: number;
  _id: string;
}
export interface IUserResponse {
  _id: string;
  email: string;
  username: string;
  phone?: string;
  isAdmin: boolean;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  gender?: EGender;
  dateOfBirth?: string;
  orders?: string[];
  reviews?: string[];
  favorites?: IFavoriteResponse[];
  addresses?: IAddressUserResponse[];
  cart?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  loggedOut: boolean;
  loggedOutAt?: string;
}
export interface IAddress {
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault: boolean;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface AddressDocument extends IAddress {
  isDefault: boolean;
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
    phone: { type: String },
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
        isDefault: { type: Boolean, default: false },
      },
    ],
    gender: {
      type: String,
      enum: Object.values(EGender),
    },
    dateOfBirth: { type: String },
    loggedOut: { type: Boolean, default: true },
    loggedOutAt: { type: Date },
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
  const salt = await bcrypt.genSalt(config.saltWorkFactor);
  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;
  return next();
});

const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export default UserModel;
