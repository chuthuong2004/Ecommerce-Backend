import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
  addAddressSchema,
  createChangePasswordSchema,
  createForgotPassword,
  createUserSchema,
  createUserSessionSchema,
  updateAddressSchema,
  updateUserSchema,
} from "../schemas/user.schema";
import express, { Request, Response } from "express";
import {
  createUserSessionHandler,
  getUserSessionHandler,
  googleLoginHandler,
  invalidateUserSessionHandler,
} from "../controllers/session.controller";
import {
  addAddressHandler,
  changePasswordHandler,
  createUserHandler,
  deleteAddressHandler,
  deleteUserHandler,
  forgotPasswordHandler,
  getAllUserHandler,
  getProfileHandler,
  getUserHandler,
  updateAddressHandler,
  updateProfileHandler,
  updateUserRoleHandler,
} from "../controllers/user.controller";

const router = express.Router();

// * REGISTER USER
// POST /api/v1/users/register
/**
 * @openapi
 * '/api/v1/users/register':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post(
  "/users/register",
  validateRequest(createUserSchema),
  createUserHandler
);

// * LOGIN USER
// POST /api/v1/users/login
/**
 * @openapi
 * '/api/v1/users/login':
 *  post:
 *     tags:
 *     - User
 *     summary: Login user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post(
  "/users/login",
  validateRequest(createUserSessionSchema),
  createUserSessionHandler
);

// * LOGIN WITH GOOGLE
// POST /api/v1/auth/google
router.post("/auth/google", googleLoginHandler);

// * LOGOUT
// DELETE /api/v1/users/logout
router.delete("/users/logout", requiresUser, invalidateUserSessionHandler);

// * FORGOT PASSWORD
// POST /api/v1/password/forgot
router.post(
  "/password/forgot",
  validateRequest(createForgotPassword),
  forgotPasswordHandler
);

// * CHANGE PASSWORD
// POST /api/v1/password/update
router.post(
  "/password/update",
  [requiresUser, validateRequest(createChangePasswordSchema)],
  changePasswordHandler
);

// * GET PROFILE
// GET /api/v1/me
router.get("/me", requiresUser, getProfileHandler);

// * UPDATE PROFILE
// PUT /api/v1/me/update
router.put(
  "/me/update",
  [requiresUser, validateRequest(updateUserSchema)],
  updateProfileHandler
);

// * ADD ADDRESS
// POST /api/v1/me/addresses/add
router.post(
  "/me/addresses/add",
  [requiresUser, validateRequest(addAddressSchema)],
  addAddressHandler
);

// * UPDATE ADDRESS
// POST /api/v1/me/addresses/:addressId
router.put(
  "/me/addresses/:addressId",
  [requiresUser, validateRequest(updateAddressSchema)],
  updateAddressHandler
);

// * DELETE ADDRESS
// POST /api/v1/me/addresses/:addressId
router.delete(
  "/me/addresses/:addressId",
  [requiresUser, validateRequest(updateAddressSchema)],
  deleteAddressHandler
);

// =============================ADMIN====================================

// * GET THE USER'S SESSIONS ---- ADMIN
// GET /api/v1/sessions
router.get("/sessions", requiresAdmin, getUserSessionHandler);

// * GET ALL USER ---- ADMIN
// GET /api/v1/admin/users
router.get("/admin/users", requiresAdmin, getAllUserHandler);

// * GET A USER ---- ADMIN
// GET /api/v1/admin/user/:userId
router.get("/admin/user/:userId", requiresAdmin, getUserHandler);

// * UPDATE USER ROLE ----- ADMIN
// PUT /api/v1/admin/user/:userId
router.put("/admin/user/:userId", requiresAdmin, updateUserRoleHandler);

// * DELETE USER ----- ADMIN
// DELETE /api/v1/admin/user/:userId
router.delete("/admin/user/:userId", requiresAdmin, deleteUserHandler);
export default router;
