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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.changePassword = exports.forgotPassword = exports.validatePassword = exports.createUser = void 0;
const lodash_1 = require("lodash");
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne({ email: input.email });
            if (user)
                return false;
            return yield user_model_1.default.create(Object.assign(Object.assign({}, input), { username: input.email.split("@")[0] }));
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createUser = createUser;
function validatePassword({ email, password, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                return false;
            }
            const isValid = yield user.comparePassword(password);
            if (!isValid) {
                return false;
            }
            return (0, lodash_1.omit)(user.toJSON(), "password");
        }
        catch (error) {
            throw error;
        }
    });
}
exports.validatePassword = validatePassword;
function forgotPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne({ email: email });
            if (!user)
                return false;
            // create reusable transporter object using the default SMTP transport
            let newPassword = Math.random().toString(36).substring(2);
            // Replace the password with the hash
            user.password = newPassword;
            yield user.save();
            try {
                yield (0, mailer_1.default)({
                    email: user.email,
                    subject: "Lấy lại mật khẩu thành công !",
                    message: `Xin chào ${user.username},<br>
          ChuthuongOnline xin gửi lại mật khẩu của bạn. <br>
          Mật khẩu mới: <b style="padding: 5px 7px; background: #eee; color: red"> ${newPassword} </b>`,
                });
            }
            catch (error) {
                return false;
            }
            return newPassword;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.forgotPassword = forgotPassword;
function changePassword({ userId, currentPassword, newPassword, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                return {
                    statusCode: 404,
                    message: "Không tìm thấy user !",
                };
            }
            const validPassword = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!validPassword) {
                return {
                    statusCode: 400,
                    message: "Mật khẩu hiện tại không đúng !",
                };
            }
            user.password = newPassword;
            yield user.save();
            return {
                statusCode: 200,
                message: "Đổi mật khẩu thành công !",
            };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.changePassword = changePassword;
function getAllUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(user_model_1.default.find({ isAdmin: false }).select("-password"), query)
                .paginating()
                .sorting()
                .searching()
                .filtering();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getAllUsers = getAllUsers;
function getUser(queryFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findOne(queryFilter)
                .select("-password")
                // .populate("reviews")
                .populate("cart")
                .lean();
            // .populate("orders");
            return user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getUser = getUser;
function updateUser(filter, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_model_1.default.findOneAndUpdate(filter, update, options);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_model_1.default.findByIdAndDelete(id);
    });
}
exports.deleteUser = deleteUser;
