import express from "express";
import {
  createMessageHandler,
  getMessageHandler,
  getMessageLatestHandler,
  updateMessageHandler,
} from "../controllers/message.controller";
import { requiresUser, validateRequest } from "../middlewares";
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
router.get(
  "/messages/seen/:conversationId/:receiverId",
  [requiresUser, validateRequest(updateMessageSchema)],
  updateMessageHandler
);

export default router;
