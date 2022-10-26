import { requiresAdmin, requiresUser, validateRequest } from "../middlewares";
import {
  addAddressSchema,
  createChangePasswordSchema,
  createForgotPassword,
  createUserSchema,
  createUserSessionSchema,
  updateAddressSchema,
} from "../schemas/user.schema";
import express from "express";
import {
  createUserSessionHandler,
  getUserSessionHandler,
  invalidateUserSessionHandler,
} from "../controllers/session.controller";
import {
  addAddressHandler,
  changePasswordHandler,
  createUserHandler,
  deleteUserHandler,
  forgotPasswordHandler,
  getAllUserHandler,
  getProfileHandler,
  getUserHandler,
  updateAddressHandler,
  updateUserRoleHandler,
} from "../controllers/user.controller";

const router = express.Router();

// * REGISTER USER - OK
// POST /api/user
router.post(
  "/users/register",
  validateRequest(createUserSchema),
  createUserHandler
);

// * LOGIN USER
// POST /api/session
router.post(
  "/users/login",
  validateRequest(createUserSessionSchema),
  createUserSessionHandler
);

// * LOGOUT
// DELETE /api/sessions
router.delete("/users/logout", requiresUser, invalidateUserSessionHandler);
// * GET THE USER'S SESSIONS
// GET /api/sessions
router.get("/sessions", requiresUser, getUserSessionHandler);

// FORGOT PASSWORD
router.post(
  "/password/forgot",
  validateRequest(createForgotPassword),
  forgotPasswordHandler
);
// * CHANGE PASSWORD
router.post(
  "/password/update",
  [requiresUser, validateRequest(createChangePasswordSchema)],
  changePasswordHandler
);

// * GET USER DETAILS
router.get("/me", requiresUser, getProfileHandler);

// ! UPDATE USER
router.put(
  "/me/update",
  requiresUser
  // updateProfile
);

// ADD ADDRESS
router.post(
  "/me/addresses/add",
  [requiresUser, validateRequest(addAddressSchema)],
  addAddressHandler
);
router.put(
  "/me/addresses/:addressId",
  [requiresUser, validateRequest(updateAddressSchema)],
  updateAddressHandler
);

// =============================ADMIN====================================
// * GET ALL USER ---- Admin
router.get("/admin/users", requiresAdmin, getAllUserHandler);
// * GET A USER ---- Admin
router.get("/admin/user/:userId", requiresAdmin, getUserHandler);
// * UPDATE USER ROLE ----- Admin
router.put("/admin/user/:userId", requiresAdmin, updateUserRoleHandler);
// * DELETE USER ----- Admin
router.delete("/admin/user/:userId", requiresAdmin, deleteUserHandler);
export default router;
