import { NextFunction, Request, Response } from "express";
import { MessageDocument } from "../models/message.model";
import {
  createMessage,
  getLatestMessage,
  getMessages,
  updateMessage,
} from "../services/message.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

export async function createMessageHandler(
  req: Request<{}, MessageDocument, MessageDocument, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    // const newMessage = {
    //     conversation: req.body.conversation,
    //     sender: req.body.sender,
    //     text: req.body.text || '',
    //     image: req.body.image || '',
    // }
    const savedMessage = await createMessage(req.body);
    res.json(savedMessage);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
export async function getMessageHandler(
  req: Request<{ conversationId: string }, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const messages = await getMessages(req.params.conversationId, req.query);
    res.json(messages);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
export async function getMessageLatestHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const message = await getLatestMessage(req.params.conversationId);
    if (!message) {
      return next(new HttpException(404, "Không tìm thấy tin nhắn !"));
    }
    return res.json(message);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
export async function updateMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await updateMessage(req.params.conversationId, req.params.receiverId);
    res.json({ message: "Cập nhật tin nhắn thành công" });
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
