"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const default_1 = __importDefault(require("../config/default"));
const privateKey = default_1.default.privateKey;
function signJwt(object, options) {
    return jsonwebtoken_1.default.sign(object, privateKey, options);
}
exports.signJwt = signJwt;
function verifyJwt(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, privateKey);
        return { valid: true, expired: false, decoded };
    }
    catch (error) {
        console.log({ alo: error });
        return {
            valid: false,
            expired: error.message === "jwt expired",
            decoded: null,
        };
    }
}
exports.verifyJwt = verifyJwt;
