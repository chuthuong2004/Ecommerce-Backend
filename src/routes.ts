import { Express, Request, Response } from "express";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  updatePostHandler,
} from "./controller/post.controller";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import { validateRequest, requiresUser } from "./middleware";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "./schema/post.schema";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    return res.sendStatus(200);
  });
  // * REGISTER USER
  // POST /api/user
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // * LOGIN USER
  // POST /api/session
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // * GET THE USER'S SESSIONS
  // GET /api/sessions
  app.get("/api/sessions", requiresUser, getUserSessionHandler);

  // * LOGOUT
  // DELETE /api/sessions
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);
  // GET /api/posts

  // CREATE A POST
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );
  // UPDATE A POST
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );
  // GET A POST
  app.get("/api/posts/:postId", getPostHandler);
  // DELETE A POST
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
