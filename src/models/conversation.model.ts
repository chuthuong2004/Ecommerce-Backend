import mongoose, { Types } from "mongoose";
import { UserDocument } from "./user.model";
// import slug from "mongoose-slug-generator";
export interface ConversationDocument extends mongoose.Document {
  members: Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}
const ConversationSchema = new mongoose.Schema<ConversationDocument>(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
const ConversationModel = mongoose.model<ConversationDocument>(
  "Conversation",
  ConversationSchema
);
export default ConversationModel;
