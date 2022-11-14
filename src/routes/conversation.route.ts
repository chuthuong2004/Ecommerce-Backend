import express from "express";
import {
  createConversationHandler,
  getConversationHandler,
} from "../controllers/conversation.controller";
import { requiresUser, validateRequest } from "../middlewares";
import { createConversationSchema } from "../schemas/conversation.schema";

const router = express.Router();

// * CREATE CONVERSATION
router.post(
  "/conversations/new",
  [requiresUser, validateRequest(createConversationSchema)],
  createConversationHandler
);
// * GET MY CONVERSATION
router.get("/conversations", requiresUser, getConversationHandler);

export default router;
