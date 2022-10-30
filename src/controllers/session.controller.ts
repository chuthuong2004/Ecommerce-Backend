import { NextFunction, Request, Response } from "express";
import {
  createAccessToken,
  createSession,
  findSessions,
  updateSession,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import HttpException from "../utils/httpException";
import config from "./../config/default";

// * LOGIN
export async function createUserSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // validate the email and password
    const user = await validatePassword(req.body);
    if (!user)
      return next(new HttpException(401, "Email hoặc mật khẩu không đúng"));
    // Create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // Create access token
    // @ts-ignore
    const accessToken = createAccessToken({ user, session });

    // Create refresh token
    const refreshToken = signJwt(
      { userId: user._id, isAdmin: user.isAdmin, sessionId: session._id },
      {
        expiresIn: config.refreshTokenTtl, // 1 year
      }
    );

    // Send refresh & access token back
    res.json({ ...user, accessToken, refreshToken });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}

// * LOGOUT
export async function invalidateUserSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionId = get(req, "user.sessionId");
    const session = await updateSession({ _id: sessionId }, { valid: false });
    if (session) return res.json({ message: "Đăng xuất thành công !" });
    next(new HttpException(400, "Không tìm thấy session"));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export async function getUserSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = get(req, "user._id");
    const sessions = await findSessions({ user: userId, valid: true });
    res.json(sessions);
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
