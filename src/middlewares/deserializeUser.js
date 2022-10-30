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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const session_service_1 = require("../services/session.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
    if (!accessToken)
        return next();
    const { decoded, expired } = (0, jwt_utils_1.verifyJwt)(accessToken);
    if (decoded) {
        // decode là user khi đã được verify token
        // @ts-ignore
        req.user = decoded;
        return next();
    }
    if (expired && refreshToken) {
        console.log("25");
        const newAccessToken = yield (0, session_service_1.reIssueAccessToken)({ refreshToken });
        console.log("ass", newAccessToken);
        if (newAccessToken) {
            // Add the new access token to the response header
            res.setHeader("x-access-token", newAccessToken);
            const { decoded } = (0, jwt_utils_1.verifyJwt)(newAccessToken);
            console.log("123123", decoded);
            // @ts-ignore
            req.user = decoded;
        }
        return next();
    }
    return next();
});
exports.default = deserializeUser;
