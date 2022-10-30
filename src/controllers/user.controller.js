"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressHandler = exports.addAddressHandler = exports.getProfileHandler = exports.deleteUserHandler = exports.updateProfileHandler = exports.updateUserRoleHandler = exports.getUserHandler = exports.getAllUserHandler = exports.changePasswordHandler = exports.forgotPasswordHandler = exports.createUserHandler = void 0;
const lodash_1 = require("lodash");
const user_service_1 = require("../services/user.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
// * REGISTER
function createUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, user_service_1.createUser)(req.body);
            if (!user)
                return next(new httpException_1.default(409, "Email đã tồn tại !"));
            res.json({
                message: "Tạo tài khoản thành công !",
                data: (0, lodash_1.omit)(user.toJSON(), "password"),
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.createUserHandler = createUserHandler;
// * FORGOT PASSWORD
function forgotPasswordHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const newPassword = yield (0, user_service_1.forgotPassword)(email);
            if (!newPassword)
                return next(new httpException_1.default(404, "Email không tồn tại !"));
            res.json({ message: `Mật khẩu mới đã gửi về email [${email}] của bạn !` });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.forgotPasswordHandler = forgotPasswordHandler;
// CHANGE PASSWORD
function changePasswordHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, lodash_1.get)(req, "user.userId");
            const result = yield (0, user_service_1.changePassword)({
                userId,
                currentPassword: (0, lodash_1.get)(req.body, "currentPassword"),
                newPassword: (0, lodash_1.get)(req.body, "newPassword"),
            });
            next(new httpException_1.default(result.statusCode, result.message));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.changePasswordHandler = changePasswordHandler;
// ! GET ALL USER
function getAllUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, user_service_1.getAllUsers)(req.query);
            res.json({
                countDocument: users.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: users,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllUserHandler = getAllUserHandler;
function getUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, lodash_1.get)(req.params, "userId");
            const user = yield (0, user_service_1.getUser)({ _id: userId });
            if (!user)
                return next(new httpException_1.default(404, "Không tìm thấy user"));
            res.json(user);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getUserHandler = getUserHandler;
function updateUserRoleHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, user_service_1.updateUser)({ _id: (0, lodash_1.get)(req.params, "userId") }, { isAdmin: (0, lodash_1.get)(req.body, "isAdmin") }, {
                new: true,
                runValidators: true,
                useFindAndModify: true,
            });
            next(new httpException_1.default(200, "Cập nhật quyền user thành công !"));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateUserRoleHandler = updateUserRoleHandler;
function updateProfileHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield (0, user_service_1.updateUser)({ _id: (0, lodash_1.get)(req, "user.userId") }, req.body, { new: true });
            res.json(updated);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateProfileHandler = updateProfileHandler;
function deleteUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, user_service_1.deleteUser)((0, lodash_1.get)(req.params, "userId"));
            next(new httpException_1.default(200, "Xóa user thành công !"));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteUserHandler = deleteUserHandler;
function getProfileHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, lodash_1.get)(req, "user.userId");
            const user = yield (0, user_service_1.getUser)({ _id: userId });
            if (!user)
                return next(new httpException_1.default(404, "Không tìm thấy user !"));
            res.json(user);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getProfileHandler = getProfileHandler;
function addAddressHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const addressInput = req.body;
            const result = yield (0, user_service_1.addAddress)(addressInput, (0, lodash_1.get)(req, "user.userId"));
            if (!result) {
                next(new httpException_1.default(400, "Lỗi thêm địa chỉ !"));
            }
            if (result.message) {
                next(new httpException_1.default(result.statusCode, result.message));
            }
            res.json({ message: "Thêm địa chỉ thành công !" });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.addAddressHandler = addAddressHandler;
function updateAddressHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const addressUpdate = req.body;
            const result = yield (0, user_service_1.updateAddress)(addressUpdate, (0, lodash_1.get)(req.params, "addressId"), (0, lodash_1.get)(req, "user.userId"));
            if (result === null || result === void 0 ? void 0 : result.message) {
                next(new httpException_1.default(result.statusCode, result.message));
            }
            res.json({ message: "Cập nhật địa chỉ thành công !" });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateAddressHandler = updateAddressHandler;
