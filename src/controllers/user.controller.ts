import { Request, Response } from "express";
import { get, omit } from "lodash";
import log from "../logger";
import UserModel from "../models/user.model";
import {
  changePassword,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUser,
  updateUser,
} from "../services/user.service";
import { QueryOption } from "../utils/ApiFeatures";

// * REGISTER
export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    if (!user) return res.status(409).json({ message: "Email đã tồn tại !" });
    return res.status(200).json({
      message: "Tạo tài khoản thành công !",
      data: omit(user.toJSON(), "password"),
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
// * FORGOT PASSWORD
export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const email = req.body.email;
    const newPassword = await forgotPassword(email);
    if (!newPassword) {
      return res.status(404).json({ message: "Email không tồn tại !" });
    }
    return res
      .status(200)
      .json({ message: `Mật khẩu mới đã gửi về email [${email}] của bạn !` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

// CHANGE PASSWORD
export async function changePasswordHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user.userId");
    const result = await changePassword({
      userId,
      currentPassword: get(req.body, "currentPassword"),
      newPassword: get(req.body, "newPassword"),
    });
    return res.status(result.statusCode).json({
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
// ! GET ALL USER
export async function getAllUserHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response
) {
  try {
    const users = await getAllUsers(req.query);
    res.status(200).json({
      success: true,
      countDocument: users.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const userId = get(req.params, "userId");
    const user = await getUser({ _id: userId });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy user !" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
}
export async function updateUserRoleHandler(req: Request, res: Response) {
  try {
    await updateUser(
      get(req.params, "userId"),
      { isAdmin: get(req.body, "isAdmin") },
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    );
    return res.status(200).json({ message: "Cập nhật user thành công !" });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export async function deleteUserHandler(req: Request, res: Response) {
  try {
    await deleteUser(get(req.params, "userId"));
    return res.status(200).json({ message: "Xóa user thành công !" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function getProfileHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user.userId");
    const user = await getUser({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user !" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
