"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSessionSchema = exports.createChangePasswordSchema = exports.createForgotPassword = exports.createUserSchema = void 0;
const yup_1 = require("yup");
exports.createUserSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)()
            .email("Vui lòng nhập địa chỉ email hợp lệ !")
            .required("Vui lòng nhập địa chỉ email !"),
        phone: (0, yup_1.string)()
            .required("Vui lòng nhập số điện thoại !")
            .matches(/^(03|09|08|07)[0-9]{8}$/, "Vui lòng nhập số điện thoại hợp lệ !"),
        password: (0, yup_1.string)()
            .required("Vui lòng nhập mật khẩu")
            .min(6, "Mật khẩu quá ngắn - tối thiểu phải có ít nhất 6 kí tự !")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Mật khẩu chỉ có thể chứa các chữ cái Latinh !"),
        // passwordConfirmation: string().oneOf(
        //   [ref("password"), null],
        //   "Password must match"
        // ),
    }),
});
exports.createForgotPassword = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)()
            .email("Vui lòng nhập địa chỉ email hợp lệ !")
            .required("Vui lòng nhập địa chỉ email !"),
    }),
});
exports.createChangePasswordSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        confirmPassword: (0, yup_1.string)()
            .required("Vui lòng nhập lại mật khẩu !")
            .min(6, "Mật khẩu nhập lại quá ngắn - tối thiểu phải có ít nhất 6 kí tự !")
            .oneOf([(0, yup_1.ref)("newPassword"), null], "Mật khẩu nhập lại không đúng !"),
        newPassword: (0, yup_1.string)()
            .required("Vui lòng nhập mật khẩu mới !")
            .min(6, "Mật khẩu mới quá ngắn - tối thiểu phải có ít nhất 6 kí tự !"),
        currentPassword: (0, yup_1.string)()
            .required("Vui lòng nhập mật khẩu hiện tại !")
            .min(6, "Mật khẩu hiện tại quá ngắn - tối thiểu phải có ít nhất 6 kí tự !"),
    }),
});
exports.createUserSessionSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        password: (0, yup_1.string)()
            .required("Vui lòng nhập mật khẩu !")
            .min(6, "Mật khẩu quá ngắn - tối thiểu phải có ít nhất 6 kí tự !")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Mật khẩu chỉ có thể chứa các chữ cái Latinh !"),
        email: (0, yup_1.string)()
            .email("Vui lòng nhập địa chỉ email hợp lệ !")
            .required("Vui lòng nhập địa chỉ email !"),
    }),
});
