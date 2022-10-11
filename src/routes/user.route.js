"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const user_schema_1 = require("../schemas/user.schema");
const express_1 = __importDefault(require("express"));
const session_controller_1 = require("../controllers/session.controller");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
// * REGISTER USER - OK
// POST /api/user
router.post("/users/register", (0, middlewares_1.validateRequest)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
// * LOGIN USER
// POST /api/session
router.post("/users/login", (0, middlewares_1.validateRequest)(user_schema_1.createUserSessionSchema), session_controller_1.createUserSessionHandler);
// * LOGOUT
// DELETE /api/sessions
router.delete("/users/logout", middlewares_1.requiresUser, session_controller_1.invalidateUserSessionHandler);
// GET /api/posts
// * GET THE USER'S SESSIONS
// GET /api/sessions
router.get("/sessions", middlewares_1.requiresUser, session_controller_1.getUserSessionHandler);
// FORGOT PASSWORD
router.post("/password/forgot", (0, middlewares_1.validateRequest)(user_schema_1.createForgotPassword), user_controller_1.forgotPasswordHandler);
// * CHANGE PASSWORD
router.post("/password/update", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(user_schema_1.createChangePasswordSchema)], user_controller_1.changePasswordHandler);
// * GET USER DETAILS
router.get("/me", middlewares_1.requiresUser, user_controller_1.getProfileHandler);
// ! UPDATE USER
// router.put(
//   "/me/update",
//   requiresUser,
//   upload.single("avatar"),
//   userController.updateProfile
// );
// =============================ADMIN====================================
// * GET ALL USER ---- Admin
router.get("/admin/users", middlewares_1.requiresAdmin, user_controller_1.getAllUserHandler);
// * GET A USER ---- Admin
router.get("/admin/user/:userId", middlewares_1.requiresAdmin, user_controller_1.getUserHandler);
// * UPDATE USER ROLE ----- Admin
router.put("/admin/user/:userId", middlewares_1.requiresAdmin, user_controller_1.updateUserRoleHandler);
// * DELETE USER ----- Admin
router.delete("/admin/user/:userId", middlewares_1.requiresAdmin, user_controller_1.deleteUserHandler);
exports.default = router;
