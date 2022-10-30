"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.updateAddressSchema = exports.addAddressSchema = exports.createUserSessionSchema = exports.createChangePasswordSchema = exports.createForgotPassword = exports.createUserSchema = void 0;
const yup_1 = require("yup");
const payloadAddress = {
    body: (0, yup_1.object)({
        address: (0, yup_1.string)().required("Vui lòng nhập địa chỉ"),
        ward: (0, yup_1.string)().required("Vui lòng chọn phường / xã !"),
        district: (0, yup_1.string)().required("Vui lòng chọn quận / huyện !"),
        province: (0, yup_1.string)().required("Vui lòng chọn tỉnh / thành !"),
        phone: (0, yup_1.string)()
            .required("Vui lòng nhập số điện thoại !")
            .matches(/^(03|09|08|07)[0-9]{8}$/, "Vui lòng nhập số điện thoại hợp lệ !"),
        lastName: (0, yup_1.string)().required("Vui lòng nhập lastName !"),
        firstName: (0, yup_1.string)().required("Vui lòng nhập firstName !"),
    }),
};
const paramsAddress = {
    params: (0, yup_1.object)({
        addressId: (0, yup_1.string)().required("addressId is required"),
    }),
};
exports.createUserSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        phone: (0, yup_1.string)()
            .required("Vui lòng nhập số điện thoại !")
            .matches(/^(03|09|08|07)[0-9]{8}$/, "Vui lòng nhập số điện thoại hợp lệ !"),
        password: (0, yup_1.string)()
            .required("Vui lòng nhập mật khẩu")
            .min(6, "Mật khẩu quá ngắn - tối thiểu phải có ít nhất 6 kí tự !")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Mật khẩu chỉ có thể chứa các chữ cái Latinh !"),
        email: (0, yup_1.string)()
            .email("Vui lòng nhập địa chỉ email hợp lệ !")
            .required("Vui lòng nhập địa chỉ email !"),
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
exports.addAddressSchema = (0, yup_1.object)(Object.assign({}, payloadAddress));
exports.updateAddressSchema = (0, yup_1.object)(Object.assign(Object.assign({}, payloadAddress), paramsAddress));
exports.updateUserSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        phone: (0, yup_1.string)()
            .notRequired()
            .matches(/^(03|09|08|07)[0-9]{8}$/, "Vui lòng nhập số điện thoại hợp lệ !"),
    }),
});
