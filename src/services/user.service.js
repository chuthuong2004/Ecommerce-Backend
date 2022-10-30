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
exports.updateAddress = exports.addAddress = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.changePassword = exports.forgotPassword = exports.validatePassword = exports.createUser = void 0;
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
            const user = yield user_model_1.default.findOne({ email }).populate({
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
            return yield user_model_1.default.findOne(queryFilter)
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
            return yield user_model_1.default.findOneAndUpdate(filter, update, options);
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
function addAddress(addressInput, userId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (addressInput.isDefault) {
                yield updateUser({
                    _id: userId,
                    "addresses.isDefault": addressInput.isDefault,
                }, {
                    $set: {
                        "addresses.$.isDefault": false,
                        firstName: addressInput.firstName,
                        lastName: addressInput.lastName,
                        phone: addressInput.phone,
                    },
                });
            }
            const user = yield getUser({ _id: userId });
            if (((_a = user === null || user === void 0 ? void 0 : user.addresses) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                addressInput.isDefault = true;
                user.firstName = addressInput.firstName;
                user.lastName = addressInput.lastName;
                user.phone = addressInput.phone;
                yield user.save();
            }
            const addressItem = (_b = user === null || user === void 0 ? void 0 : user.addresses) === null || _b === void 0 ? void 0 : _b.find((address) => address.firstName === addressInput.firstName &&
                address.lastName === addressInput.lastName &&
                address.phone === addressInput.phone &&
                address.province === addressInput.province &&
                address.district === addressInput.district &&
                address.ward === addressInput.ward &&
                address.address === addressInput.address);
            if (addressItem) {
                return {
                    statusCode: 400,
                    message: "Địa chỉ đã tồn tại !",
                };
            }
            return yield updateUser({ _id: userId }, { $push: { addresses: addressInput } }, { new: true });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addAddress = addAddress;
function updateAddress(addressUpdate, addressId, userId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield getUser({ _id: userId });
            if (!user) {
                return {
                    statusCode: 404,
                    message: "Không tìm thấy người dùng !",
                };
            }
            const address = (_a = user.addresses) === null || _a === void 0 ? void 0 : _a.find((item) => String(item._id) === addressId);
            if (!address) {
                return {
                    statusCode: 404,
                    message: "Không tìm thấy địa chỉ của bạn !",
                };
            }
            if (addressUpdate.isDefault) {
                yield updateUser({
                    _id: userId,
                    "addresses.isDefault": addressUpdate.isDefault,
                }, {
                    $set: {
                        "addresses.$.isDefault": false,
                        firstName: addressUpdate.firstName,
                        lastName: addressUpdate.lastName,
                        phone: addressUpdate.phone,
                    },
                });
            }
            else {
                if (address.isDefault && user.addresses) {
                    yield updateUser({
                        _id: userId,
                        "addresses._id": user.addresses[0]._id,
                    }, {
                        $set: {
                            "addresses.$.isDefault": true,
                            firstName: addressUpdate.firstName,
                            lastName: addressUpdate.lastName,
                            phone: addressUpdate.phone,
                        },
                    });
                }
            }
            return yield updateUser({
                _id: userId,
                "addresses._id": addressId,
            }, {
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
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateAddress = updateAddress;
