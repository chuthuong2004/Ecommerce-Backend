import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createConversation,
  getMyConversations,
  updateConversation,
} from "../services/conversation.service";
import HttpException from "../utils/httpException";

export async function createConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { receiverId } = req.body;
    const newConversation = await createConversation(
      receiverId,
      get(req, "user.userId"),
      get(req, "user.isAdmin")
    );
    res.json(newConversation);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
export async function getConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await getMyConversations(get(req, "user.userId"));
    return res.json(conversation);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
export async function updateConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await updateConversation(
      { _id: req.params.conversationId },
      { updatedAt: Date.now() },
      { new: true }
    );
    if (!conversation) {
      return next(new HttpException(404, "Không tìm thấy conversationId"));
    }
    return res.json(conversation);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
