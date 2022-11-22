import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ConversationModel, {
  ConversationDocument,
} from "../models/conversation.model";
import { createMessage } from "./message.service";
import { getUser } from "./user.service";

export async function createConversation(
  receiverId: string,
  userId: string,
  isAdmin: string
): Promise<ConversationDocument> {
  try {
    // nếu user không là admin thì set receiverId=userAdmin
    if (!isAdmin) {
      const userAdmin = await getUser({ isAdmin: true });
      if (userAdmin) receiverId = userAdmin?._id;
    }
    const newConversation = new ConversationModel({
      members: [userId, receiverId],
    });
    await newConversation.save();
    if (!isAdmin) {
      const newMessage = await createMessage({
        conversation: String(newConversation._id),
        sender: receiverId,
        text: "Chào bạn, xin cảm ơn bạn đã nhắn tin cho Koga. Koga có thể tư vấn gì cho mình ạ? Nếu cần hỗ trợ gấp bạn có thể liên hệ Hotline 1900 252538 để được tư vấn nhanh nhất.",
      });
    }
    return await newConversation.populate({
      path: "members",
      select: "-password -orders -reviews -favorites -addresses -cart",
    });
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
