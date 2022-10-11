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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
var EGender;
(function (EGender) {
    EGender["Male"] = "Nam";
    EGender["Female"] = "N\u1EEF";
    EGender["Other"] = "Other";
})(EGender || (EGender = {}));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        // required: true,
        minLength: 6,
        maxLength: 25,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String },
    cart: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Cart",
    },
    orders: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    favorites: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
            size: { type: String },
            color: { type: String },
            colorId: { type: String },
        },
    ],
    addresses: [
        {
            firstName: { type: String },
            lastName: { type: String },
            phone: { type: String },
            province: { type: String },
            district: { type: String },
            ward: { type: String },
            address: { type: String },
            isDefault: { type: Boolean, default: false },
        },
    ],
    gender: { type: String, enum: Object.values(EGender) },
    dateOfBirth: { type: String },
}, { timestamps: true });
// Used for logging in
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcrypt_1.default.compare(candidatePassword, user.password).catch((e) => false);
    });
};
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        // only hash the password if it has been modified (or is new)
        if (!user.isModified("password"))
            return next();
        // Random additional data
        const salt = yield bcrypt_1.default.genSalt(config_1.default.get("saltWorkFactor"));
        const hash = yield bcrypt_1.default.hashSync(user.password, salt);
        // Replace the password with the hash
        user.password = hash;
        return next();
    });
});
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
