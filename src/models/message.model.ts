import mongoose, { Types } from "mongoose";

export interface MessageDocument extends mongoose.Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  image: string;
  seen: boolean;
  seenAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
    image: { type: String },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true }
);
const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);
export default MessageModel;
