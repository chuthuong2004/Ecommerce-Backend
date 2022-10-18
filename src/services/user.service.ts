import { omit } from "lodash";
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";
import sendEmail from "../utils/mailer";
import bcrypt from "bcrypt";
import log from "../logger";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    const user = await UserModel.findOne({ email: input.email });
    if (user) return false;
    return await UserModel.create({
      ...input,
      username: input.email.split("@")[0],
    });
  } catch (error) {
    throw error;
  }
}
export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  try {
    const user = await UserModel.findOne({ email }).populate({
      path: "favorites",
      populate: {
        path: "product",
        select: "_id name price discount colors brand slug",
        populate: { path: "brand", select: "_id name" },
      },
    });
    if (!user) {
      return false;
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return false;
    }
    return omit(user.toJSON(), "password");
  } catch (error) {
    throw error;
  }
}
export async function forgotPassword(email: string) {
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) return false;
    // create reusable transporter object using the default SMTP transport
    let newPassword = Math.random().toString(36).substring(2);
    // Replace the password with the hash
    user.password = newPassword;
    await user.save();
    try {
      await sendEmail({
        email: user.email,
        subject: "Lấy lại mật khẩu thành công !",
        message: `Xin chào ${user.username},<br>
          ChuthuongOnline xin gửi lại mật khẩu của bạn. <br>
          Mật khẩu mới: <b style="padding: 5px 7px; background: #eee; color: red"> ${newPassword} </b>`,
      });
    } catch (error) {
      return false;
    }
    return newPassword;
  } catch (error) {
    throw error;
  }
}
export async function changePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        message: "Không tìm thấy user !",
      };
    }
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return {
        statusCode: 400,
        message: "Mật khẩu hiện tại không đúng !",
      };
    }
    user.password = newPassword;
    await user.save();
    return {
      statusCode: 200,
      message: "Đổi mật khẩu thành công !",
    };
  } catch (error) {
    throw error;
  }
}
export async function getAllUsers(
  query: QueryOption
): Promise<Array<UserDocument>> {
  try {
    const features = new APIFeatures(
      UserModel.find({ isAdmin: false }).select("-password"),
      query
    )
      .paginating()
      .sorting()
      .searching()
      .filtering();
    return await features.query;
  } catch (error) {
    throw error;
  }
}
export async function getUser(queryFilter: FilterQuery<UserDocument>) {
  try {
    const user = await UserModel.findOne(queryFilter)
      .select("-password")
      // .populate("reviews")
      .populate("cart")
      .populate({
        path: "favorites",
        populate: {
          path: "product",
          select: "_id name price discount colors brand slug",
          populate: { path: "brand", select: "_id name" },
        },
      })
      .lean();
    // .populate("orders");
    return user;
  } catch (error) {
    throw error;
  }
}
export async function updateUser(
  filter: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options?: QueryOptions<UserDocument>
) {
  try {
    await UserModel.findOneAndUpdate(filter, update, options);
  } catch (error) {
    throw error;
  }
}
export async function deleteUser(id: string) {
  await UserModel.findByIdAndDelete(id);
}
