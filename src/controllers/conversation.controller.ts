import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createConversation,
  getConversation,
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
      get(req, "user.userId")
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
    const conversation = await getConversation(get(req, "user.userId"));
    return res.json(conversation);
  } catch (error: any) {
    return next(new HttpException(500, error.message));
  }
}
