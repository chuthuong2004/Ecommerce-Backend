import { object, string, ref } from "yup";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - phone
 *      properties:
 *        email:
 *          type: string
 *          default: vanthuong.dao2004@gmail.com
 *        password:
 *          type: string
 *          default: 123456
 *        phone:
 *          type: string
 *          default: "0986432588"
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        phone:
 *          type: string
 *        isAdmin:
 *          type: boolean
 *        orders:
 *          type: array
 *          items:
 *            type: object
 *        reviews:
 *          type: array
 *          items:
 *            type: object
 *        favorites:
 *          type: array
 *          items:
 *            type: object
 *        addresses:
 *          type: array
 *          items:
 *            type: object
 *        loggedOut:
 *          type: boolean
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *    LoginUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: vanthuong.dao2004@gmail.com
 *        password:
 *          type: string
 *          default: 123456
 */

const payloadAddress = {
  body: object({
    address: string().required("Vui lòng nhập địa chỉ"),
    ward: string().required("Vui lòng chọn phường / xã !"),
    district: string().required("Vui lòng chọn quận / huyện !"),
    province: string().required("Vui lòng chọn tỉnh / thành !"),
    phone: string()
      .required("Vui lòng nhập số điện thoại !")
      .matches(
        /^(03|09|08|07)[0-9]{8}$/,
        "Vui lòng nhập số điện thoại hợp lệ !"
      ),
    lastName: string().required("Vui lòng nhập lastName !"),
    firstName: string().required("Vui lòng nhập firstName !"),
  }),
};
const paramsAddress = {
  params: object({
    addressId: string().required("addressId is required"),
  }),
};
export const createUserSchema = object({
  body: object({
    phone: string()
      .required("Vui lòng nhập số điện thoại !")
      .matches(
        /^(03|09|08|07)[0-9]{8}$/,
        "Vui lòng nhập số điện thoại hợp lệ !"
      ),
    password: string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu quá ngắn - tối thiểu phải có ít nhất 6 kí tự !")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "Mật khẩu chỉ có thể chứa các chữ cái Latinh !"
      ),
    email: string()
      .email("Vui lòng nhập địa chỉ email hợp lệ !")
      .required("Vui lòng nhập địa chỉ email !"),

    // passwordConfirmation: string().oneOf(
    //   [ref("password"), null],
    //   "Password must match"
    // ),
  }),
});
export const createForgotPassword = object({
  body: object({
    email: string()
      .email("Vui lòng nhập địa chỉ email hợp lệ !")
      .required("Vui lòng nhập địa chỉ email !"),
  }),
});
export const createChangePasswordSchema = object({
  body: object({
    confirmPassword: string()
      .required("Vui lòng nhập lại mật khẩu !")
      .min(
        6,
        "Mật khẩu nhập lại quá ngắn - tối thiểu phải có ít nhất 6 kí tự !"
      )
      .oneOf([ref("newPassword"), null], "Mật khẩu nhập lại không đúng !"),
    newPassword: string()
      .required("Vui lòng nhập mật khẩu mới !")
      .min(6, "Mật khẩu mới quá ngắn - tối thiểu phải có ít nhất 6 kí tự !"),
    currentPassword: string()
      .required("Vui lòng nhập mật khẩu hiện tại !")
      .min(
        6,
        "Mật khẩu hiện tại quá ngắn - tối thiểu phải có ít nhất 6 kí tự !"
      ),
  }),
});
export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Vui lòng nhập mật khẩu !")
      .min(6, "Mật khẩu quá ngắn - tối thiểu phải có ít nhất 6 kí tự !")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "Mật khẩu chỉ có thể chứa các chữ cái Latinh !"
      ),
    email: string()
      .email("Vui lòng nhập địa chỉ email hợp lệ !")
      .required("Vui lòng nhập địa chỉ email !"),
  }),
});
export const addAddressSchema = object({
  ...payloadAddress,
});
export const updateAddressSchema = object({
  ...payloadAddress,
  ...paramsAddress,
});
export const updateUserSchema = object({
  body: object({
    phone: string()
      .notRequired()
      .matches(
        /^(03|09|08|07)[0-9]{8}$/,
        "Vui lòng nhập số điện thoại hợp lệ !"
      ),
  }),
});
