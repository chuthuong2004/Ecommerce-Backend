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
export async function getConversation(
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
