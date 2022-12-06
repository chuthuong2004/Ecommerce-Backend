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

// * CREATE NEW MESSAGE
// POST /api/v1/messages
router.post(
  "/messages",
  [requiresUser, validateRequest(createMessageSchema)],
  createMessageHandler
);
// * GET MESSAGES FROM CONVERSATION
// GET /api/v1/messages/:conversationId
router.get(
  "/messages/:conversationId",
  [requiresUser, validateRequest(getMessageSchema)],
  getMessageHandler
);
// * GET MESSAGE LATEST FROM CONVERSATION
// GET /api/v1/messages/latest/:conversationId
router.get(
  "/messages/latest/:conversationId",
  [requiresUser, validateRequest(getMessageSchema)],
  getMessageLatestHandler
);
// * UPDATE VIEWED MESSAGE
// PUT /api/v1/messages/seen/:conversationId/:receiverId
router.put(
  "/messages/seen/:conversationId/:receiverId",
  [requiresUser, validateRequest(updateMessageSchema)],
  updateMessageHandler
);
// * DELETE MESSAGE FROM CONVERSATION
// DELETE /api/v1/messages/latest/:conversationId
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
