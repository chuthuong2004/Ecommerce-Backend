import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../service/session.service";
import { decode } from "../utils/jwt.utils";

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
  const { decoded, expired } = decode(accessToken);
  if (decoded) {
    // decode là user khi đã được verify token
    // @ts-ignore
    req.user = decoded;
    return next();
  }
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);
      const { decoded } = decode(newAccessToken);

      // @ts-ignore
      req.user = decoded;
    }
    return next();
  }
  return next();
};
export default deserializeUser;
