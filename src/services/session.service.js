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
exports.findSessions = exports.updateSession = exports.reIssueAccessToken = exports.createAccessToken = exports.createSession = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const config_1 = __importDefault(require("config"));
const jwt_utils_1 = require("../utils/jwt.utils");
const lodash_1 = require("lodash");
const user_service_1 = require("./user.service");
function createSession(userId, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield session_model_1.default.create({ user: userId, userAgent });
        return session.toJSON();
    });
}
exports.createSession = createSession;
function createAccessToken({ user, session, }) {
    // Build and return the new access token
    const accessToken = (0, jwt_utils_1.signJwt)({ userId: user._id, isAdmin: user.isAdmin, sessionId: session._id }, { expiresIn: config_1.default.get("accessTokenTtl") } // 15 minutes
    );
    return accessToken;
}
exports.createAccessToken = createAccessToken;
// * REFRESH TOKEN
function reIssueAccessToken({ refreshToken, }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Decode the refresh token
        const { decoded } = (0, jwt_utils_1.verifyJwt)(refreshToken);
        console.log(decoded);
        if (!decoded || !(0, lodash_1.get)(decoded, "sessionId"))
            return false;
        // Get the session
        const session = yield session_model_1.default.findById((0, lodash_1.get)(decoded, "sessionId"));
        // Make sure the session is still valid
        if (!session || !(session === null || session === void 0 ? void 0 : session.valid))
            return false;
        const user = yield (0, user_service_1.getUser)({ _id: session.user });
        if (!user)
            return false;
        const accessToken = createAccessToken({ user, session });
        return accessToken;
    });
}
exports.reIssueAccessToken = reIssueAccessToken;
// *  UPDATE SESSION
function updateSession(query, update) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_model_1.default.updateOne(query, update);
    });
}
exports.updateSession = updateSession;
// * FIND SESSION
function findSessions(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_model_1.default.find(query).lean();
    });
}
exports.findSessions = findSessions;
