import { Request, Response } from "express";
import {
  createAccessToken,
  createSession,
  findSessions,
  updateSession,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import { get } from "lodash";

// * LOGIN
export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body);
  console.log(user);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Email hoặc mật khẩu không đúng !" });
  }
  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // Create access token
  // @ts-ignore
  const accessToken = createAccessToken({ user, session });

  // Create refresh token
  const refreshToken = signJwt(
    { userId: user._id, isAdmin: user.isAdmin, sessionId: session._id },
    {
      expiresIn: config.get<string>("refreshTokenTtl"), // 1 year
    }
  );

  // Send refresh & access token back
  return res.status(200).json({ ...user, accessToken, refreshToken });
}

// * LOGOUT
export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");
  await updateSession({ _id: sessionId }, { valid: false });
  return res.status(200).json({ message: "Đăng xuất thành công !" });
}
export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}
