import { object, string, ref } from "yup";
export const createUserSchema = object({
  body: object({
    email: string()
      .email("Vui lòng nhập địa chỉ email hợp lệ !")
      .required("Vui lòng nhập địa chỉ email !"),
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
