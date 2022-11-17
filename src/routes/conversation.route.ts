import express from "express";
import {
  createConversationHandler,
  getConversationHandler,
  updateConversationHandler,
} from "../controllers/conversation.controller";
import { requiresUser, validateRequest } from "../middlewares";
import {
  createConversationSchema,
  updateConversationSchema,
} from "../schemas/conversation.schema";

const router = express.Router();

// * CREATE CONVERSATION
router.post(
  "/conversations/new",
  [requiresUser, validateRequest(createConversationSchema)],
  createConversationHandler
);
// * GET MY CONVERSATION
router.get("/conversations", requiresUser, getConversationHandler);

// * UPDATE CONVERSATION
router.put(
  "/conversations/:conversationId",
  [requiresUser, validateRequest(updateConversationSchema)],
  updateConversationHandler
);

export default router;
