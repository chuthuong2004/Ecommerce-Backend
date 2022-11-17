import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ConversationModel, {
  ConversationDocument,
} from "../models/conversation.model";

export async function createConversation(
  receiverId: string,
  userId: string
): Promise<ConversationDocument> {
  try {
    const newConversation = new ConversationModel({
      members: [userId, receiverId],
    });

    return await newConversation.save();
  } catch (error) {
    throw error;
  }
}
export async function getMyConversations(
  userId: string
): Promise<ConversationDocument[]> {
  try {
    return await ConversationModel.find({
      members: { $in: [userId] },
    })
      .sort("-updatedAt")
      .populate({
        path: "members",
        select: "-password -orders -reviews -favorites -addresses -cart",
      });
  } catch (error) {
    throw error;
  }
}
export async function updateConversation(
  filter: FilterQuery<ConversationDocument>,
  update: UpdateQuery<ConversationDocument>,
  options: QueryOptions
): Promise<ConversationDocument | undefined> {
  try {
    const updatedConversation = await ConversationModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return await updatedConversation?.populate({
      path: "members",
      select: "-password -orders -reviews -favorites -addresses -cart",
    });
  } catch (error) {
    throw error;
  }
}
