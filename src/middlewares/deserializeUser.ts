import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../services/session.service";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = get(req, "headers.x-refresh");
  if (!accessToken) return next();
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    // decode là user khi đã được verify token
    // @ts-ignore
    req.user = decoded;
    return next();
  }
  if (expired && refreshToken) {
    // console.log("25");

    const newAccessToken = await reIssueAccessToken({ refreshToken });
    // console.log("ass", newAccessToken);

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);
      const { decoded } = verifyJwt(newAccessToken);
      // console.log("123123", decoded);

      // @ts-ignore
      req.user = decoded;
    }
    return next();
  }
  return next();
};
export default deserializeUser;
