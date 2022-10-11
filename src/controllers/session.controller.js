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
exports.getUserSessionHandler = exports.invalidateUserSessionHandler = exports.createUserSessionHandler = void 0;
const session_service_1 = require("../services/session.service");
const user_service_1 = require("../services/user.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const config_1 = __importDefault(require("config"));
const lodash_1 = require("lodash");
const httpException_1 = __importDefault(require("../utils/httpException"));
// * LOGIN
function createUserSessionHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // validate the email and password
            const user = yield (0, user_service_1.validatePassword)(req.body);
            if (!user)
                return next(new httpException_1.default(401, "Email hoặc mật khẩu không đúng"));
            // Create a session
            const session = yield (0, session_service_1.createSession)(user._id, req.get("user-agent") || "");
            // Create access token
            // @ts-ignore
            const accessToken = (0, session_service_1.createAccessToken)({ user, session });
            // Create refresh token
            const refreshToken = (0, jwt_utils_1.signJwt)({ userId: user._id, isAdmin: user.isAdmin, sessionId: session._id }, {
                expiresIn: config_1.default.get("refreshTokenTtl"), // 1 year
            });
            // Send refresh & access token back
            res.json(Object.assign(Object.assign({}, user), { accessToken, refreshToken }));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.createUserSessionHandler = createUserSessionHandler;
// * LOGOUT
function invalidateUserSessionHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionId = (0, lodash_1.get)(req, "user.session");
            yield (0, session_service_1.updateSession)({ _id: sessionId }, { valid: false });
            res.json({ message: "Đăng xuất thành công !" });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.invalidateUserSessionHandler = invalidateUserSessionHandler;
function getUserSessionHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, lodash_1.get)(req, "user._id");
            const sessions = yield (0, session_service_1.findSessions)({ user: userId, valid: true });
            res.json(sessions);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getUserSessionHandler = getUserSessionHandler;
