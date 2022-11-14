import { DocumentDefinition } from "mongoose";
import MessageModel, { MessageDocument } from "../models/message.model";

export async function createMessage(
  input: DocumentDefinition<MessageDocument>
): Promise<MessageDocument> {
  try {
    const newMessage = new MessageModel(input);
    await newMessage.save();
    return await newMessage.populate({
      path: "sender",
      select: "-password -orders -reviews -favorites -addresses -cart",
    });
  } catch (error) {
    throw error;
  }
}
export async function getMessage(
  conversationId: string
): Promise<MessageDocument[]> {
  try {
    return await MessageModel.find({
      conversation: conversationId,
    }).populate({
      path: "sender",
      select: "-password -orders -reviews -favorites -addresses -cart",
    });
  } catch (error) {
    throw error;
  }
}
export async function updateMessage(
  conversationId: string,
  receiverId: string
) {
  try {
    await MessageModel.updateMany(
      {
        conversationId,
        sender: receiverId,
        seen: false,
      },
      {
        seen: true,
        seenAt: Date.now(),
      }
    );
  } catch (error) {
    throw error;
  }
}
