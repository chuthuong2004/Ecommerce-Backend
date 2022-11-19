import mongoose, { Types } from "mongoose";
import { IUserResponse } from "./user.model";

export interface MessageDocument extends mongoose.Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  images: string[];
  seen: boolean;
  seenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface IMessageResponse {
  _id: string;
  conversation: string;
  sender: IUserResponse;
  text: string;
  images?: string[];
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  seenAt?: string;
  __v: number;
}

const MessageSchema = new mongoose.Schema<MessageDocument>(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    images: [{ type: String }],
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true }
);
const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);
export default MessageModel;
