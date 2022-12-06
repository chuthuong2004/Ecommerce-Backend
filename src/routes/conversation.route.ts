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
// POST /api/v1/conversation/new
router.post(
  "/conversations/new",
  [requiresUser, validateRequest(createConversationSchema)],
  createConversationHandler
);
// * GET MY CONVERSATION
// GET /api/v1/conversations
router.get("/conversations", requiresUser, getConversationHandler);

// * UPDATE CONVERSATION
// PUT /api/v1/conversations/:conversationsId
router.put(
  "/conversations/:conversationId",
  [requiresUser, validateRequest(updateConversationSchema)],
  updateConversationHandler
);

export default router;
