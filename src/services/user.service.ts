import { omit } from "lodash";
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import UserModel, { IAddress, UserDocument } from "../models/user.model";
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
    return await UserModel.findOne(queryFilter)
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
      });
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
    return await UserModel.findOneAndUpdate(filter, update, options);
  } catch (error) {
    throw error;
  }
}
export async function deleteUser(id: string) {
  await UserModel.findByIdAndDelete(id);
}
export async function addAddress(
  addressInput: IAddress,
  userId: string
): Promise<UserDocument | null | { statusCode: number; message: string }> {
  try {
    if (addressInput.isDefault) {
      await updateUser(
        {
          _id: userId,
          "addresses.isDefault": addressInput.isDefault,
        },
        {
          $set: {
            "addresses.$.isDefault": false,
            firstName: addressInput.firstName,
            lastName: addressInput.lastName,
            phone: addressInput.phone,
          },
        }
      );
    }
    const user = await getUser({ _id: userId });
    if (user?.addresses?.length === 0) {
      addressInput.isDefault = true;
      user.firstName = addressInput.firstName;
      user.lastName = addressInput.lastName;
      user.phone = addressInput.phone;
      await user.save();
    }
    const addressItem = user?.addresses?.find(
      (address: IAddress) =>
        address.firstName === addressInput.firstName &&
        address.lastName === addressInput.lastName &&
        address.phone === addressInput.phone &&
        address.province === addressInput.province &&
        address.district === addressInput.district &&
        address.ward === addressInput.ward &&
        address.address === addressInput.address
    );
    if (addressItem) {
      return {
        statusCode: 400,
        message: "Địa chỉ đã tồn tại !",
      };
    }
    return await updateUser(
      { _id: userId },
      { $push: { addresses: addressInput } },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
}
export async function updateAddress(
  addressUpdate: IAddress,
  addressId: string,
  userId: string
): Promise<UserDocument | null | { statusCode: number; message: string }> {
  try {
    const user = await getUser({ _id: userId });
    if (!user) {
      return {
        statusCode: 404,
        message: "Không tìm thấy người dùng !",
      };
    }
    const address = user.addresses?.find(
      (item: IAddress) => String(item._id) === addressId
    );
    if (!address) {
      return {
        statusCode: 404,
        message: "Không tìm thấy địa chỉ của bạn !",
      };
    }
    if (addressUpdate.isDefault) {
      await updateUser(
        {
          _id: userId,
          "addresses.isDefault": addressUpdate.isDefault,
        },
        {
          $set: {
            "addresses.$.isDefault": false,
          },
        }
      );
    } else {
      if (address.isDefault && user.addresses) {
        await updateUser(
          {
            _id: userId,
            "addresses._id": user.addresses[0]._id,
          },
          {
            $set: {
              "addresses.$.isDefault": true,
            },
          }
        );
      }
    }

    return await updateUser(
      {
        _id: userId,
        "addresses._id": addressId,
      },
      {
        $set: {
          "addresses.$.isDefault": addressUpdate.isDefault,
          "addresses.$.firstName": addressUpdate.firstName,
          "addresses.$.lastName": addressUpdate.lastName,
          "addresses.$.phone": addressUpdate.phone,
          "addresses.$.province": addressUpdate.province,
          "addresses.$.district": addressUpdate.district,
          "addresses.$.ward": addressUpdate.ward,
          "addresses.$.address": addressUpdate.address,
        },
      }
    );
  } catch (error) {
    throw error;
  }
}
