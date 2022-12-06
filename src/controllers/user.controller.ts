import { NextFunction, Request, Response } from "express";
import { get, omit } from "lodash";
import log from "../logger";
import UserModel, { IAddress } from "../models/user.model";
import {
  addAddress,
  changePassword,
  createUser,
  deleteAddress,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUser,
  updateAddress,
  updateUser,
} from "../services/user.service";
import { QueryOption } from "../utils/ApiFeatures";
import HttpException from "../utils/httpException";

// * REGISTER
export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body);
    if (!user) return next(new HttpException(409, "Email đã tồn tại !"));
    res.json({
      message: "Tạo tài khoản thành công !",
      data: omit(user.toJSON(), "password"),
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
// * FORGOT PASSWORD
export async function forgotPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.body.email;
    const newPassword = await forgotPassword(email);
    if (!newPassword)
      return next(new HttpException(404, "Email không tồn tại !"));
    res.json({ message: `Mật khẩu mới đã gửi về email [${email}] của bạn !` });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}

// CHANGE PASSWORD
export async function changePasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = get(req, "user.userId");
    const result = await changePassword({
      userId,
      currentPassword: get(req.body, "currentPassword"),
      newPassword: get(req.body, "newPassword"),
    });
    next(new HttpException(result.statusCode, result.message));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
// ! GET ALL USER
export async function getAllUserHandler(
  req: Request<{}, {}, {}, QueryOption>,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getAllUsers(req.query);
    res.json({
      countDocument: users.length,
      resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
      data: users,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}

export async function getUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = get(req.params, "userId");
    const user = await getUser({ _id: userId });
    if (!user) return next(new HttpException(404, "Không tìm thấy user"));
    res.json(user);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateUserRoleHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await updateUser(
      { _id: get(req.params, "userId") },
      { isAdmin: get(req.body, "isAdmin") },
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    );
    next(new HttpException(200, "Cập nhật quyền user thành công !"));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function updateProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await updateUser(
      { _id: get(req, "user.userId") },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteUser(get(req.params, "userId"));
    next(new HttpException(200, "Xóa user thành công !"));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = get(req, "user.userId");
    const user = await getUser({ _id: userId });
    if (!user) return next(new HttpException(404, "Không tìm thấy user !"));
    res.json(user);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function addAddressHandler(
  req: Request<{}, IAddress, IAddress, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const addressInput: IAddress = req.body;
    const result: any = await addAddress(addressInput, get(req, "user.userId"));
    if (!result) {
      next(new HttpException(400, "Lỗi thêm địa chỉ !"));
    }
    if (result.message) {
      next(new HttpException(result.statusCode, result.message));
    }
    res.json({ message: "Thêm địa chỉ thành công !" });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}

export async function updateAddressHandler(
  req: Request<{}, IAddress, IAddress, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const addressUpdate: IAddress = req.body;
    const result: any = await updateAddress(
      addressUpdate,
      get(req.params, "addressId"),
      get(req, "user.userId")
    );
    if (result?.message) {
      next(new HttpException(result.statusCode, result.message));
    }
    res.json({ message: "Cập nhật địa chỉ thành công !" });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function deleteAddressHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deletedAddress = await deleteAddress(
      req.params.addressId,
      get(req, "user.userId")
    );
    if (!deletedAddress) {
      return next(
        new HttpException(404, "Không tìm thấy thông tin địa chỉ của bạn.")
      );
    } else {
      return next(
        new HttpException(200, "Đã xóa địa chỉ giao hàng của bạn thành công.")
      );
    }
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
