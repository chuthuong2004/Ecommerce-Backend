import express, { Request, Response } from "express";
import {
  createMessageHandler,
  getMessageHandler,
  getMessageLatestHandler,
  updateMessageHandler,
} from "../controllers/message.controller";
import { requiresUser, validateRequest } from "../middlewares";
import MessageModel from "./../models/message.model";
import {
  createMessageSchema,
  getMessageSchema,
  updateMessageSchema,
} from "../schemas/message.schema";

const router = express.Router();

// * CREATE CONVERSATION
router.post(
  "/messages",
  [requiresUser, validateRequest(createMessageSchema)],
  createMessageHandler
);
// * GET MESSAGES FROM CONVERSATION
router.get(
  "/messages/:conversationId",
  [requiresUser, validateRequest(getMessageSchema)],
  getMessageHandler
);
// * GET MESSAGE LATEST FROM CONVERSATION
router.get(
  "/messages/latest/:conversationId",
  [requiresUser, validateRequest(getMessageSchema)],
  getMessageLatestHandler
);
// * UPDATE MESSAGE SEEN
router.put(
  "/messages/seen/:conversationId/:receiverId",
  [requiresUser, validateRequest(updateMessageSchema)],
  updateMessageHandler
);
router.delete(
  "/message/:conversationId",
  async (req: Request, res: Response) => {
    try {
      const deleted = await MessageModel.deleteMany({
        conversation: req.params.conversationId,
      });
      return res.json(deleted);
    } catch (error) {}
  }
);

export default router;
