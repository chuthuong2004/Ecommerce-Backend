import { DocumentDefinition } from "mongoose";
import MessageModel, { MessageDocument } from "../models/message.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";

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

export async function getMessages(
  conversationId: string,
  query: QueryOption
): Promise<MessageDocument[]> {
  try {
    const features = new APIFeatures(
      MessageModel.find(
        {
          conversation: conversationId,
        },
        {}
      ).populate({
        path: "sender",
        select: "-password -orders -reviews -favorites -addresses -cart",
      }),
      query
    )
      .paginating()
      .sorting()
      .searching()
      .filtering();
    return await features.query;
  } catch (error) {
    throw error;
  }
}
export async function getLatestMessage(conversationId: string) {
  try {
    return await MessageModel.findOne(
      { conversation: conversationId },
      {},
      { sort: { createdAt: -1 } }
    ).populate({
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
